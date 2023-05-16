import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../../Hooks/useFetchData";
import { getTrainings } from "../../../api/trainingApi";
import TrainingLogForm from "../../../components/admin/form/TrainingLogForm";
import { Constants } from "../../../constant/constant";
import Title from "../../../layouts/Title";
import { ArticleInfoType } from "../../../types/ArticleInfoType";

function AdminTrainingLogDetail() {
  const { id } = useParams();
  const [trainingLogArray, setTrainingLogArray] = useState<ArticleInfoType[]>();
  const [trainingLog, setTrainingLog] = useState<ArticleInfoType>();

  /*
    TODO 
    훈련일지는 모든 데이터 필요 
    1. 퀴리 요청에서 순차적으로 2022, 2023, ... 으로 프론트에서 계속 요청
    2. 백에서 한번에 다주기
  */
  const { loading, error, response } = useFetchData(getTrainings, "2022");

  useEffect(() => {
    if (!loading && !error && response) {
      const reversedDatas = response.trainingLogs.slice(0).reverse();
      setTrainingLogArray(reversedDatas);
    }
  }, [loading, error, response]);

  useEffect(() => {
    const targetArticle = trainingLogArray?.find(
      (item) => item.id.toString() === id
    );

    setTrainingLog(targetArticle);
  }, [trainingLogArray]);

  if (!trainingLogArray || !trainingLog) return <></>;

  return (
    <>
      <Title title={"훈련일지 수정"} color={Constants.BLACK_COLOR} />
      <TrainingLogForm data={trainingLog} />
    </>
  );
}

export default AdminTrainingLogDetail;
