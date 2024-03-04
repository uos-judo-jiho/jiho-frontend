import { useParams } from "react-router-dom";
import TrainingLogForm from "../../../components/admin/form/TrainingLogForm";
import { Constants } from "../../../constant/constant";
import Title from "../../../layouts/Title";
import { useTrainings } from "../../../recoills/tranings";

function AdminTrainingLogDetail() {
  const { id } = useParams();

  /*
    TODO 
    훈련일지는 모든 데이터 필요 
    1. 퀴리 요청에서 순차적으로 2022, 2023, ... 으로 프론트에서 계속 요청
    2. 백에서 한번에 다주기
  */
  const { trainings } = useTrainings();
  const trainingLog = trainings.find((item) => item.id.toString() === id);

  return (
    <>
      <Title title={"훈련일지 수정"} color={Constants.BLACK_COLOR} />
      <TrainingLogForm data={trainingLog} />
    </>
  );
}

export default AdminTrainingLogDetail;
