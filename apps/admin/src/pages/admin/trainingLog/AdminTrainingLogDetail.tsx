import TrainingLogForm from "@/components/admin/form/TrainingLogForm";
import Title from "@/components/layouts/Title";
import { Constants } from "@/shared/lib/constant";
import { v1Api } from "@packages/api";
import { useParams } from "react-router-dom";

const AdminTrainingLogDetail = () => {
  const { id } = useParams();

  const { data: trainings = [] } = v1Api.useGetApiV1Trainings(undefined, {
    query: {
      select: (response) => response.data.trainingLogs,
    },
  });
  const trainingLog = trainings?.find((item) => item.id.toString() === id);

  return (
    <>
      <Title title={"훈련일지 수정"} color={Constants.BLACK_COLOR} />
      <TrainingLogForm data={trainingLog} />
    </>
  );
};

export default AdminTrainingLogDetail;
