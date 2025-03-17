import { useTrainings } from "@/recoills/tranings";
import { useParams } from "react-router-dom";
import TrainingLogForm from "@/components/admin/form/TrainingLogForm";
import { Constants } from "@/lib/constant";
import Title from "@/components/layouts/Title";

const AdminTrainingLogDetail = () => {
  const { id } = useParams();

  const { trainings } = useTrainings();
  const trainingLog = trainings?.find((item) => item.id.toString() === id);

  return (
    <>
      <Title title={"훈련일지 수정"} color={Constants.BLACK_COLOR} />
      <TrainingLogForm data={trainingLog} />
    </>
  );
};

export default AdminTrainingLogDetail;
