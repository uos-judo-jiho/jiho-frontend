import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { processVideo, uploadSession, type ProcessResult } from "@/lib/sidecar";

function formatSec(value: number): string {
  const total = Math.max(0, Math.round(value));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [uploadOriginal, setUploadOriginal] = useState(false);

  const processMutation = useMutation({
    mutationFn: (video: File) => processVideo(video, setProgress),
    onSuccess: (data) => {
      setResult(data);
      toast.success(`하이라이트 ${data.highlights.length}개 추출 완료`);
    },
    onError: (error: unknown) => {
      toast.error(`처리 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (sessionId: string) => uploadSession(sessionId, uploadOriginal),
    onSuccess: (data) => {
      const originalNote = data.uploadedOriginal ? ", 원본 포함" : "";
      toast.success(`업로드 완료 — job #${data.jobId} (${data.uploadedClips}개 클립${originalNote})`);
    },
    onError: (error: unknown) => {
      toast.error(`업로드 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    },
  });

  const handlePick = () => fileInputRef.current?.click();

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    setFile(picked);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">유도 하이라이트 업로더 (내부용)</h1>
        <p className="mt-1 text-sm text-gray-500">
          로컬에서 영상을 처리해 하이라이트만 추출하고, 서버에 업로드합니다.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-m4v,video/webm"
          className="hidden"
          onChange={handleFile}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePick}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            영상 선택
          </button>
          <span className="text-sm text-gray-600">{file ? file.name : "선택된 파일 없음"}</span>
        </div>

        <button
          type="button"
          disabled={!file || processMutation.isPending}
          onClick={() => file && processMutation.mutate(file)}
          className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-indigo-500"
        >
          {processMutation.isPending ? `처리 중… ${progress}%` : "로컬 처리 시작"}
        </button>
      </section>

      {result && (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              하이라이트 {result.highlights.length}개
              {result.durationSec != null && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (영상 길이 {formatSec(result.durationSec)})
                </span>
              )}
            </h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={uploadOriginal}
                  onChange={(e) => setUploadOriginal(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                원본도 업로드
              </label>
              <button
                type="button"
                disabled={uploadMutation.isPending || result.highlights.length === 0}
                onClick={() => uploadMutation.mutate(result.sessionId)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-emerald-500"
              >
                {uploadMutation.isPending ? "업로드 중…" : "서버에 업로드"}
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {result.highlights.map((h) => (
              <li key={h.index} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <video src={h.clipUrl} controls className="w-full rounded-md bg-black" />
                <div className="mt-2 flex justify-between text-xs text-gray-600">
                  <span>이벤트 {formatSec(h.eventSec)}</span>
                  <span>신뢰도 {h.confidence.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
