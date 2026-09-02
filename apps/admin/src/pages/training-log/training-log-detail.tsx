import TrainingLogForm from "@/components/admin/form/TrainingLogForm";
import { ReactionStatus } from "@/features/reaction";
import { v2Api } from "@packages/api";
import { assert } from "es-toolkit";
import { useParams } from "@tanstack/react-router";

export const TrainingLogDetail = () => {
  const { id } = useParams({ strict: false });

  assert(id !== undefined, "훈련일지 ID가 없습니다.");

  const { data: trainingLog } = v2Api.useGetTrainingLogSuspense(
    Number(id),
    {
      query: {
        select: (response) => response.data.training,
      },
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <ReactionStatus boardId={Number(id)} />
      <TrainingLogForm data={trainingLog} />
    </div>
  );
};
