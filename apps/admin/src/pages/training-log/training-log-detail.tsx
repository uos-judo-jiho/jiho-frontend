import TrainingLogForm from "@/components/admin/form/TrainingLogForm";
import { v2Api } from "@packages/api";
import { assert } from "es-toolkit";
import { useParams } from "@tanstack/react-router";

export const TrainingLogDetail = () => {
  const { id } = useParams({ strict: false });

  assert(id !== undefined, "훈련일지 ID가 없습니다.");

  const { data: trainingLog } = v2Api.useGetApiV2TrainingIdSuspense(
    Number(id),
    {
      query: {
        select: (response) => response.data.training,
      },
    },
  );

  return <TrainingLogForm data={trainingLog} />;
};
