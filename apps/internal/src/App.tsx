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
  discardItem,
  downloadHighlights,
  fetchQueue,
  processVideos,
  sidecarErrorMessage,
  uploadItem,
  type ItemStatus,
  type QueueItem,
} from "@/lib/sidecar";

const SESSION_QUERY_KEY = ["admin-session"] as const;
const QUEUE_QUERY_KEY = ["sidecar-queue"] as const;

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

const isBusy = (status: ItemStatus) =>
  status === "queued" || status === "processing";

export default function App() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [transferProgress, setTransferProgress] = useState(0);

  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: getAdminSession,
    retry: false,
  });

  const isAuthed = !!sessionQuery.data;

  const queueQuery = useQuery({
    queryKey: QUEUE_QUERY_KEY,
    queryFn: fetchQueue,
    enabled: isAuthed,
    refetchInterval: (query) =>
      query.state.data?.items.some((item) => isBusy(item.status))
        ? 1500
        : false,
  });

  const processMutation = useMutation({
    mutationFn: (picked: File[]) => processVideos(picked, setTransferProgress),
    onMutate: () => setTransferProgress(0),
    onSuccess: (data) => {
      queryClient.setQueryData(QUEUE_QUERY_KEY, data);
      void queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY });
      setFiles([]);
      setTransferProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`${data.items.length}개 항목을 큐에 추가했습니다.`);
    },
    onError: (error: unknown) => {
      setTransferProgress(0);
      toast.error(`처리 실패: ${sidecarErrorMessage(error, "알 수 없는 오류")}`);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.setQueryData<AdminProfile | null>(SESSION_QUERY_KEY, null);
      setFiles([]);
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
  const items = queueQuery.data?.items ?? [];
  const pendingCount = items.filter((item) => isBusy(item.status)).length;
  const processLabel =
    transferProgress < 100
      ? `영상 전송 중… ${transferProgress}%`
      : "큐에 추가하는 중…";

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []));
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
                여러 영상을 한 번에 추가하면 큐에 쌓아 하나씩 하이라이트를
                추출합니다.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/mp4,video/quicktime,video/x-m4v,video/webm"
            className="hidden"
            onChange={handleFiles}
          />

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700">
                  {files.length > 0
                    ? `${files.length}개 영상 선택됨`
                    : "처리할 영상을 선택하세요 (여러 개 가능)"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {files.length > 0
                    ? formatBytes(files.reduce((sum, f) => sum + f.size, 0))
                    : "MP4, MOV, M4V 또는 WebM"}
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

            {files.length > 0 && (
              <ul className="mt-4 space-y-1 text-xs text-slate-500">
                {files.map((file) => (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex justify-between gap-3"
                  >
                    <span className="truncate">{file.name}</span>
                    <span className="shrink-0">{formatBytes(file.size)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            disabled={files.length === 0 || isProcessing}
            onClick={() => files.length > 0 && processMutation.mutate(files)}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? processLabel : "큐에 추가하고 처리 시작"}
          </button>
        </section>

        <section className="mt-6">
          <div className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              2
            </span>
            <div>
              <h2 className="font-semibold">처리 큐</h2>
              <p className="mt-1 text-sm text-slate-500">
                {pendingCount > 0
                  ? `처리 대기/진행 ${pendingCount}건`
                  : "처리 대기 중인 항목이 없습니다."}
                {" · 업로드하지 않은 결과는 재시작 후에도 유지됩니다."}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400">
              아직 처리한 영상이 없습니다.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const STATUS_META: Record<ItemStatus, { label: string; className: string }> = {
  queued: { label: "대기 중", className: "bg-slate-100 text-slate-600" },
  processing: { label: "처리 중", className: "bg-indigo-100 text-indigo-700" },
  done: { label: "처리 완료", className: "bg-emerald-100 text-emerald-700" },
  failed: { label: "실패", className: "bg-red-100 text-red-700" },
};

function ItemCard({ item }: { item: QueueItem }) {
  const queryClient = useQueryClient();
  const [uploadOriginal, setUploadOriginal] = useState(false);

  const invalidateQueue = () =>
    queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY });

  const uploadMutation = useMutation({
    mutationFn: () => uploadItem(item.id, uploadOriginal && item.hasOriginal),
    onSuccess: (data) => {
      const originalNote = data.uploadedOriginal ? ", 원본 포함" : "";
      toast.success(
        `업로드 완료 — 작업 #${data.jobId}, 클립 ${data.uploadedClips}개${originalNote}`,
      );
      void invalidateQueue();
    },
    onError: (error: unknown) =>
      toast.error(
        `업로드 실패: ${sidecarErrorMessage(error, "알 수 없는 오류")}`,
      ),
  });

  const discardMutation = useMutation({
    mutationFn: () => discardItem(item.id),
    onSuccess: () => void invalidateQueue(),
    onError: (error: unknown) =>
      toast.error(`삭제 실패: ${sidecarErrorMessage(error, "알 수 없는 오류")}`),
  });

  const status = STATUS_META[item.status];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
            <p className="truncate text-sm font-semibold text-slate-800">
              {item.originalFilename}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {item.status === "done"
              ? `하이라이트 ${item.highlights.length}개`
              : "—"}
            {item.durationSec != null &&
              ` · 원본 ${formatSec(item.durationSec)}`}
          </p>
        </div>

        {item.status === "done" && item.highlights.length > 0 && (
          <button
            type="button"
            onClick={() => downloadHighlights(item.id)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            전체 ZIP
          </button>
        )}
      </div>

      {item.status === "processing" && (
        <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-4 text-center text-sm text-indigo-700">
          로컬 모델이 영상을 분석하고 있습니다…
        </p>
      )}

      {item.status === "queued" && (
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
          처리 순서를 기다리고 있습니다.
        </p>
      )}

      {item.status === "failed" && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="min-w-0 break-words">
            {item.error ?? "처리에 실패했습니다."}
          </span>
          <button
            type="button"
            onClick={() => discardMutation.mutate()}
            disabled={discardMutation.isPending}
            className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            삭제
          </button>
        </div>
      )}

      {item.status === "done" && (
        <>
          {item.highlights.length === 0 ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-4 text-center text-sm text-amber-800">
              추출된 하이라이트가 없습니다.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {item.highlights.map((highlight) => (
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

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label
              className={`flex items-center gap-2 text-sm ${
                item.hasOriginal ? "text-slate-600" : "text-slate-400"
              }`}
            >
              <input
                type="checkbox"
                checked={uploadOriginal && item.hasOriginal}
                disabled={!item.hasOriginal}
                onChange={(event) => setUploadOriginal(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              />
              원본 영상도 함께 업로드 (최대 60MB)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => discardMutation.mutate()}
                disabled={discardMutation.isPending || uploadMutation.isPending}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                캐시 삭제
              </button>
              <button
                type="button"
                disabled={
                  uploadMutation.isPending || item.highlights.length === 0
                }
                onClick={() => uploadMutation.mutate()}
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadMutation.isPending
                  ? "인증 확인 및 업로드 중…"
                  : "서버에 업로드"}
              </button>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
