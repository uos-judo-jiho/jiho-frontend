# @apps/internal — 유도 하이라이트 업로더 (내부용)

로컬에서 유도 영상을 처리해 **하이라이트 클립만** 추출하고, 실제 API에 업로드하는
내부 전용 도구입니다. 무거운 ML 추론은 서버가 아니라 이 도구를 실행하는 로컬
머신에서 수행합니다.

## 구성

- **SPA (`src/`)** — Vite + React + TypeScript + Tailwind (admin 앱과 동일 스택).
  영상 선택 → 로컬 처리 → 하이라이트 미리보기 → 서버 업로드.
- **사이드카 (`server/index.ts`)** — 로컬 Node(Express) 프로세스. 브라우저가
  직접 못 하는 일을 대신한다:
  1. 영상을 받아 `jiho-video-worker/local_runner.py` 실행 (YOLO 추론)
  2. 생성된 클립을 미리보기용으로 스트리밍
  3. 실제 API로 업로드 (`POST /videos/ingest` → `POST /highlights/:id/clip`)

```
[브라우저 SPA] ──/sidecar──▶ [로컬 사이드카] ──spawn──▶ [python local_runner.py]
                                   │
                                   └──fetch──▶ [실제 API: /videos/ingest, /highlights/:id/clip]
```

## 사전 준비

- `jiho-video-worker`가 로컬에 체크아웃되어 있고 `uv sync` 완료
- `models/yolov8n-pose.pt`, `ffmpeg` 준비 (워커 README 참고)
- `.env` 작성 (`.env.example` 복사) — 특히 `WORKER_DIR`, `API_BASE_URL`

## 실행

```bash
pnpm -C apps/internal dev   # vite(3002) + 사이드카(5174) 동시 실행
```

브라우저에서 http://localhost:3002 접속 → 영상 선택 → 로컬 처리 → 서버에 업로드.
