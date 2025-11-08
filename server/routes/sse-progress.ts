import type { Request, Response } from "express";
import { validateSSEToken } from "../utils/sse-tokens.js";
import { uploadProgressMap } from "../utils/upload-progress.js";

// SSE endpoint for upload progress
export function handleSSEProgress(req: Request, res: Response): void {
  const { uploadId, token } = req.query;

  if (
    !uploadId ||
    !token ||
    typeof uploadId !== "string" ||
    typeof token !== "string"
  ) {
    res.status(400).json({ error: "uploadId and token are required" });
    return;
  }

  // 임시 토큰 검증
  const validation = validateSSEToken(uploadId, token, req.ip || "");
  if (!validation.valid) {
    console.warn(
      `[SECURITY] SSE _internal API 접근 거부 - ${validation.reason}: uploadId=${uploadId}, token=${token} from ${req.ip}`,
    );
    res.status(403).json({
      error: "Invalid or expired token",
      reason: validation.reason,
    });
    return;
  }

  console.info(
    `[SSE] 업로드 진행 상황 연결 성공: uploadId=${uploadId} from ${req.ip}`,
  );

  // SSE 헤더 설정
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // 초기 연결 확인
  res.write('data: {"type":"connected","uploadId":"' + uploadId + '"}\n\n');

  // 진행 상황 전송 함수
  const sendProgress = () => {
    const progress = uploadProgressMap.get(uploadId);
    if (progress) {
      res.write(
        `data: ${JSON.stringify({
          type: "progress",
          ...progress,
        })}\n\n`,
      );

      // 완료되거나 에러가 발생한 경우 연결 종료
      if (progress.status === "completed" || progress.status === "error") {
        res.write('data: {"type":"close"}\n\n');
        res.end();
        return;
      }
    }
  };

  // 초기 진행 상황 전송
  sendProgress();

  // 주기적으로 진행 상황 확인 (1초마다)
  const progressInterval = setInterval(sendProgress, 1000);

  // 클라이언트 연결 종료 시 정리
  req.on("close", () => {
    clearInterval(progressInterval);
    res.end();
  });

  // 30초 후 자동 종료
  setTimeout(() => {
    clearInterval(progressInterval);
    res.write('data: {"type":"timeout"}\n\n');
    res.end();
  }, 30000);
}
