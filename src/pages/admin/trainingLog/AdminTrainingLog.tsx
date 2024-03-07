import { Link } from "react-router-dom";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { useTrainings } from "../../../recoills/tranings";
import { useEffect } from "react";

function AdminTrainingLog() {
  const { trainings, fetch } = useTrainings();
  useEffect(() => {
    fetch();
  }, []);

  const handleNewArticle = (event: React.MouseEvent<HTMLButtonElement>) => {};
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
