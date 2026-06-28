import { useQuery } from "@tanstack/react-query";

import {
  fetchQueue,
  QUEUE_QUERY_KEY,
} from "@/features/highlight-queue/api/sidecar";
import { isBusy } from "@/features/highlight-queue/lib/format";
import { QueueList } from "@/features/highlight-queue/ui/queue-list";
import { UploaderForm } from "@/features/highlight-queue/ui/uploader-form";
import { LabelExportPanel } from "@/features/labels/ui/label-export-panel";

export function UploaderPage() {
  const queueQuery = useQuery({
    queryKey: QUEUE_QUERY_KEY,
    queryFn: fetchQueue,
    refetchInterval: (query) =>
      query.state.data?.items.some((item) => isBusy(item.status))
        ? 1500
        : false,
  });

  const items = queueQuery.data?.items ?? [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <UploaderForm />
      <QueueList items={items} />
      <LabelExportPanel />
    </main>
  );
}
