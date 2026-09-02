import type { ContentSummary } from "@/shared/lib/types/content";
import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/empty-state";
import { TrainingCard } from "./training-card";

type TrainingGridProps = {
  trainings: ContentSummary[];
  className?: string;
};

export const TrainingGrid = ({ trainings, className }: TrainingGridProps) => {
  if (trainings.length === 0) {
    return <EmptyState title="아직 등록된 훈련일지가 없습니다" />;
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4",
        className,
      )}
    >
      {trainings.map((training, i) => (
        <li key={training.id}>
          <TrainingCard training={training} priority={i < 8} />
        </li>
      ))}
    </ul>
  );
};
