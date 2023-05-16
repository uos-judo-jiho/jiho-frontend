import { useEffect, useState } from "react";
import FormContainer from "../../../components/admin/form/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import useFetchData from "../../../Hooks/useFetchData";
import { getTrainings } from "../../../api/trainingApi";
import { Link } from "react-router-dom";

function AdminTrainingLog() {
  const [trainingLogArray, setTrainingLogArray] = useState<ArticleInfoType[]>();

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

  if (!trainingLogArray) return <></>;

  function handleNewArticle(event: React.MouseEvent<HTMLButtonElement>) {}
  return (
    <FormContainer title="훈련일지 관리">
      <Link to="/admin/training/write">
        <button onClick={handleNewArticle}>새 글쓰기</button>
      </Link>
      <ListContainer
        datas={trainingLogArray}
        targetUrl={"/admin/training/"}
      ></ListContainer>
    </FormContainer>
  );
}

export default AdminTrainingLog;
