import { v2Api } from "@packages/api";
import { linkOptions } from "@tanstack/react-router";
import { useMemo } from "react";

import { TrainingCard } from "@/features/training";
import { MoreLink } from "@/shared/ui/more-link";
import { SectionHeading } from "@/shared/ui/section-heading";

const PREVIEW_COUNT = 8;

/** 최근 훈련일지 미리보기. */
export const HomeLatestTrainings = () => {
  const { data: trainings = [] } = v2Api.useGetApiV2TrainingsSuspense(
    undefined,
    { query: { select: (response) => response.data.trainingLogs ?? [] } },
  );

  const recent = useMemo(
    () =>
      [...trainings]
        .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
        .slice(0, PREVIEW_COUNT),
    [trainings],
  );

  if (recent.length === 0) return null;

  return (
    <section className="flex flex-col gap-8">
      <SectionHeading
        eyebrow="Training"
        title="훈련일지"
        action={
          <MoreLink link={linkOptions({ to: "/photo" })}>전체 보기</MoreLink>
        }
      />

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {recent.map((training) => (
          <li key={training.id}>
            <TrainingCard training={training} />
          </li>
        ))}
      </ul>
    </section>
  );
};
