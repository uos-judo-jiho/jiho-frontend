import { linkOptions } from "@tanstack/react-router";

import { useLatestBoards } from "@/features/content";
import { TrainingCard } from "@/features/training";
import { MoreLink } from "@/shared/ui/more-link";
import { SectionHeading } from "@/shared/ui/section-heading";

/** 홈에서 보여주는 최근 훈련일지 수. 라우트 loader 가 같은 값으로 프리페치한다. */
export const HOME_TRAINING_LIMIT = 8;

/** 최근 훈련일지 미리보기. 서버가 최신순으로 주므로 화면에서 다시 정렬하지 않는다. */
export const HomeLatestTrainings = () => {
  const trainings = useLatestBoards({
    type: "training",
    limit: HOME_TRAINING_LIMIT,
  });

  if (trainings.length === 0) return null;

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
        {trainings.map((training) => (
          <li key={training.id}>
            <TrainingCard training={training} />
          </li>
        ))}
      </ul>
    </section>
  );
};
