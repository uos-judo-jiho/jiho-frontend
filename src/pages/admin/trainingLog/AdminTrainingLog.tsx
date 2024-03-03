import { Link } from "react-router-dom";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { useTrainings } from "../../../recoills/tranings";

function AdminTrainingLog() {
  /*
    TODO 
    훈련일지는 모든 데이터 필요 
    1. 퀴리 요청에서 순차적으로 2022, 2023, ... 으로 프론트에서 계속 요청
    2. 백에서 한번에 다주기
  */
  const { trainings } = useTrainings();

  function handleNewArticle(event: React.MouseEvent<HTMLButtonElement>) {}
  return (
    <FormContainer title="훈련일지 관리">
      <Link to="/admin/training/write">
        <NewArticleButton onClick={handleNewArticle}>
          새 글쓰기
        </NewArticleButton>
      </Link>
      <ListContainer
        datas={trainings}
        targetUrl={"/admin/training/"}
        additionalTitle={true}
      ></ListContainer>
    </FormContainer>
  );
}

export default AdminTrainingLog;
