import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  processVideos,
  QUEUE_QUERY_KEY,
  sidecarErrorMessage,
} from "@/features/highlight-queue/api/sidecar";
import { formatBytes } from "@/features/highlight-queue/lib/format";

export function UploaderForm() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [transferProgress, setTransferProgress] = useState(0);

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

  const isProcessing = processMutation.isPending;
  const processLabel =
    transferProgress < 100
      ? `영상 전송 중… ${transferProgress}%`
      : "큐에 추가하는 중…";

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
          1
        </span>
        <div>
          <h2 className="font-semibold">로컬 영상 처리</h2>
          <p className="mt-1 text-sm text-slate-500">
            여러 영상을 한 번에 추가하면 큐에 쌓아 하나씩 하이라이트를 추출합니다.
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
  );
}
