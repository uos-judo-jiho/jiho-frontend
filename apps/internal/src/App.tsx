import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import LoginView from "@/LoginView";
import {
  apiErrorMessage,
  getAdminSession,
  logoutAdmin,
  type AdminProfile,
} from "@/lib/auth";
import {
  downloadHighlights,
  MAX_ORIGINAL_UPLOAD_BYTES,
  processVideo,
  sidecarErrorMessage,
  uploadSession,
  type ProcessResult,
} from "@/lib/sidecar";

const SESSION_QUERY_KEY = ["admin-session"] as const;

function formatSec(value: number): string {
  const total = Math.max(0, Math.round(value));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatBytes(value: number): string {
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function App() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [transferProgress, setTransferProgress] = useState(0);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [uploadOriginal, setUploadOriginal] = useState(false);

  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: getAdminSession,
    retry: false,
  });

  const processMutation = useMutation({
    mutationFn: (video: File) => processVideo(video, setTransferProgress),
    onMutate: () => {
      setResult(null);
      setTransferProgress(0);
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success(`하이라이트 ${data.highlights.length}개를 추출했습니다.`);
    },
    onError: (error: unknown) => {
      setTransferProgress(0);
      toast.error(
        `처리 실패: ${sidecarErrorMessage(error, "알 수 없는 오류")}`,
      );
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (sessionId: string) => uploadSession(sessionId, uploadOriginal),
    onSuccess: (data) => {
      const originalNote = data.uploadedOriginal ? ", 원본 포함" : "";
      toast.success(
        `업로드 완료 — 작업 #${data.jobId}, 클립 ${data.uploadedClips}개${originalNote}`,
      );
    },
    onError: (error: unknown) => {
      toast.error(
        `업로드 실패: ${sidecarErrorMessage(error, "알 수 없는 오류")}`,
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.setQueryData<AdminProfile | null>(SESSION_QUERY_KEY, null);
      setFile(null);
      setResult(null);
    },
    onError: (error) =>
      toast.error(apiErrorMessage(error, "로그아웃에 실패했습니다.")),
  });

  if (sessionQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        관리자 세션을 확인하고 있습니다…
      </main>
    );
  }

  if (sessionQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <section className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-700">
            {apiErrorMessage(
              sessionQuery.error,
              "관리자 세션을 확인하지 못했습니다.",
            )}
          </p>
          <button
            type="button"
            onClick={() => sessionQuery.refetch()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            다시 시도
          </button>
        </section>
      </main>
    );
  }

  if (!sessionQuery.data) {
    return (
      <LoginView
        onLogin={(profile) =>
          queryClient.setQueryData(SESSION_QUERY_KEY, profile)
        }
      />
    );
  }

  const profile = sessionQuery.data;
  const userName = profile.user.additionalInfo?.name || profile.user.email;
  const isProcessing = processMutation.isPending;
  const isOriginalTooLarge = !!file && file.size > MAX_ORIGINAL_UPLOAD_BYTES;
  const processLabel =
    transferProgress < 100
      ? `영상 전송 중… ${transferProgress}%`
      : "로컬 모델이 영상을 분석하고 있습니다…";

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    setFile(picked);
    if (picked && picked.size > MAX_ORIGINAL_UPLOAD_BYTES) {
      setUploadOriginal(false);
    }
    setResult(null);
    setTransferProgress(0);
  };

  const handleDownloadAll = () => {
    if (!result) return;
    downloadHighlights(result.sessionId);
    toast.success("하이라이트 ZIP 다운로드를 시작합니다.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              UOS Judo
            </p>
            <h1 className="mt-1 text-lg font-bold">하이라이트 업로더</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-700">{userName}</p>
              <p className="text-xs uppercase text-slate-400">
                {profile.user.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              1
            </span>
            <div>
              <h2 className="font-semibold">로컬 영상 처리</h2>
              <p className="mt-1 text-sm text-slate-500">
                영상을 사이드카로 전송한 뒤 로컬 모델로 하이라이트를 추출합니다.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-m4v,video/webm"
            className="hidden"
            onChange={handleFile}
          />

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700">
                  {file ? file.name : "처리할 영상을 선택하세요"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {file ? formatBytes(file.size) : "MP4, MOV, M4V 또는 WebM"}
                </p>
              </div>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                영상 선택
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={!file || isProcessing}
            onClick={() => file && processMutation.mutate(file)}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? processLabel : "하이라이트 추출 시작"}
          </button>
        </section>

        {result && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  2
                </span>
                <div>
                  <h2 className="font-semibold">추출 결과</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    하이라이트 {result.highlights.length}개
                    {result.durationSec != null &&
                      ` · 원본 ${formatSec(result.durationSec)}`}
                  </p>
                </div>
              </div>
              {result.highlights.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  전체 ZIP 다운로드
                </button>
              )}
            </div>

            {result.highlights.length === 0 ? (
              <p className="mt-6 rounded-xl bg-amber-50 px-4 py-5 text-center text-sm text-amber-800">
                추출된 하이라이트가 없습니다. 다른 영상을 선택해 다시
                처리해주세요.
              </p>
            ) : (
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {result.highlights.map((highlight) => (
                  <li
                    key={highlight.index}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <video
                      src={highlight.clipUrl}
                      controls
                      preload="metadata"
                      className="aspect-video w-full bg-black"
                    />
                    <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-800">
                          하이라이트 {highlight.index + 1}
                        </p>
                        <p className="mt-1">
                          {formatSec(highlight.startSec)}–
                          {formatSec(highlight.endSec)} · 신뢰도{" "}
                          {highlight.confidence.toFixed(2)}
                        </p>
                      </div>
                      <a
                        href={highlight.clipUrl}
                        download={`highlight_${highlight.index + 1}.mp4`}
                        className="shrink-0 font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        다운로드
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={uploadOriginal}
                    disabled={isOriginalTooLarge}
                    onChange={(event) =>
                      setUploadOriginal(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  원본 영상도 함께 업로드 (최대 60MB)
                </label>
                <button
                  type="button"
                  disabled={
                    uploadMutation.isPending || result.highlights.length === 0
                  }
                  onClick={() => uploadMutation.mutate(result.sessionId)}
                  className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadMutation.isPending
                    ? "인증 확인 및 업로드 중…"
                    : "서버에 업로드"}
                </button>
              </div>
              {isOriginalTooLarge && (
                <p className="mt-3 text-sm text-amber-700">
                  선택한 원본이 60MB를 초과해 하이라이트 클립만 업로드할 수
                  있습니다.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
