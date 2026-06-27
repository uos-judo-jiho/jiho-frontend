import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
  discardItem,
  downloadHighlights,
  QUEUE_QUERY_KEY,
  sidecarErrorMessage,
  uploadItem,
  type ItemStatus,
  type QueueItem,
} from "@/features/highlight-queue/api/sidecar";
import { formatSec } from "@/features/highlight-queue/lib/format";

const STATUS_META: Record<ItemStatus, { label: string; className: string }> = {
  queued: { label: "대기 중", className: "bg-slate-100 text-slate-600" },
  processing: { label: "처리 중", className: "bg-indigo-100 text-indigo-700" },
  done: { label: "처리 완료", className: "bg-emerald-100 text-emerald-700" },
  failed: { label: "실패", className: "bg-red-100 text-red-700" },
};

export function QueueItemCard({ item }: { item: QueueItem }) {
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
      toast.error(
        `삭제 실패: ${sidecarErrorMessage(error, "알 수 없는 오류")}`,
      ),
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
