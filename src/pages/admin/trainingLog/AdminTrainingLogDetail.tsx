import { useParams } from "react-router-dom";
import TrainingLogForm from "../../../components/admin/form/TrainingLogForm";
import { Constants } from "../../../constant";
import Title from "../../../layouts/Title";
import { useTrainings } from "../../../recoills/tranings";
import { useEffect } from "react";

const AdminTrainingLogDetail = () => {
  const { id } = useParams();

  const { trainings, refreshTraining } = useTrainings();
  const trainingLog = trainings.find((item) => item.id.toString() === id);

  useEffect(() => {
    refreshTraining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Title title={"훈련일지 수정"} color={Constants.BLACK_COLOR} />
      <TrainingLogForm data={trainingLog} />
    </>
  );
};

export default AdminTrainingLogDetail;
