import { v2Api } from "@packages/api";
import { useMemo } from "react";

import { TrainingGrid } from "@/features/training";
import { PageHeader } from "@/shared/ui/page-header";
import { PageShell } from "@/widgets/page-shell";

/** 훈련일지 목록. */
export const TrainingIndexPage = () => {
  const { data: trainings = [] } = v2Api.useGetApiV2TrainingsSuspense(
    undefined,
    { query: { select: (response) => response.data.trainingLogs ?? [] } },
  );

  const sorted = useMemo(
    () => [...trainings].sort((a, b) => b.dateTime.localeCompare(a.dateTime)),
    [trainings],
  );

  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="Training"
          title="훈련일지"
          description="정규 운동과 합숙, 대회 준비 과정을 사진으로 남깁니다."
          action={
            <span data-numeric className="text-caption text-ink-subtle tabular-nums">
              총 {sorted.length}건
            </span>
          }
        />
        <TrainingGrid trainings={sorted} />
      </div>
    </PageShell>
  );
};
