import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchAllLabels,
  labelsErrorMessage,
  type LabelExportItem,
} from "@/features/labels/api/labels";

function timestamp(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}`
  );
}

function downloadJson(items: LabelExportItem[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    total: items.length,
    items,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `uos-judo-labels-${timestamp()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function LabelExportPanel() {
  const [progress, setProgress] = useState<{
    loaded: number;
    total: number;
  } | null>(null);

  const exportMutation = useMutation({
    mutationFn: () => fetchAllLabels((loaded, total) => setProgress({ loaded, total })),
    onMutate: () => setProgress(null),
    onSuccess: (items) => {
      if (items.length === 0) {
        toast.info("내보낼 라벨이 아직 없습니다.");
        return;
      }
      downloadJson(items);
      toast.success(`라벨 ${items.length}건을 내려받았습니다.`);
    },
    onError: (error: unknown) =>
      toast.error(labelsErrorMessage(error, "라벨 내보내기에 실패했습니다.")),
    onSettled: () => setProgress(null),
  });

  const isExporting = exportMutation.isPending;

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          3
        </span>
        <div>
          <h2 className="font-semibold">라벨 내보내기</h2>
          <p className="mt-1 text-sm text-slate-500">
            관리자들이 작성한 라벨링 결과를 JSON 으로 내려받아 jiho-video-worker
            모델 학습에 사용합니다. (root 권한 필요)
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {isExporting && progress
            ? `수집 중… ${progress.loaded}/${progress.total}`
            : "전체 라벨을 한 번에 모아 파일로 저장합니다."}
        </p>
        <button
          type="button"
          disabled={isExporting}
          onClick={() => exportMutation.mutate()}
          className="shrink-0 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? "내보내는 중…" : "라벨 JSON 내보내기"}
        </button>
      </div>
    </section>
  );
}
