import { type QueueItem } from "@/features/highlight-queue/api/sidecar";
import { isBusy } from "@/features/highlight-queue/lib/format";
import { QueueItemCard } from "@/features/highlight-queue/ui/QueueItemCard";

export function QueueList({ items }: { items: QueueItem[] }) {
  const pendingCount = items.filter((item) => isBusy(item.status)).length;

  return (
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
            <QueueItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
