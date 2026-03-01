import TrainingLogForm from "@/components/admin/form/TrainingLogForm";
import Title from "@/components/layouts/Title";
import { Constants } from "@/shared/lib/constant";
import { v2Api } from "@packages/api";
import { assert } from "es-toolkit";
import { useParams } from "react-router-dom";

export const TrainingLogDetail = () => {
  const { id } = useParams<{ id: string }>();

  assert(id !== undefined, "훈련일지 ID가 없습니다.");

  const { data: trainingLog } = v2Api.useGetApiV2TrainingIdSuspense(
    Number(id),
    {
      query: {
        select: (response) => response.data.training,
      },
    },
  );

  return (
    <>
      <Title title={"훈련일지 수정"} color={Constants.BLACK_COLOR} />
      <TrainingLogForm data={trainingLog} />
    </>
  );
};
