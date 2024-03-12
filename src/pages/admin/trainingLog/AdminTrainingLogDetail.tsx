import { useParams } from "react-router-dom";
import TrainingLogForm from "../../../components/admin/form/TrainingLogForm";
import { Constants } from "../../../constant/constant";
import Title from "../../../layouts/Title";
import { useTrainings } from "../../../recoills/tranings";
import { useEffect } from "react";

function AdminTrainingLogDetail() {
  const { id } = useParams();

  const { trainings, refreshTraining } = useTrainings();
  const trainingLog = trainings.find((item) => item.id.toString() === id);

  useEffect(() => {
    refreshTraining();
  }, []);

  return (
    <>
      <Title title={"훈련일지 수정"} color={Constants.BLACK_COLOR} />
      <TrainingLogForm data={trainingLog} />
    </>
  );
}

export default AdminTrainingLogDetail;
