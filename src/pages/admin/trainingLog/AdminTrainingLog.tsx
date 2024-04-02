import { Link } from "react-router-dom";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { useTrainings } from "../../../recoills/tranings";
import { useEffect } from "react";
import Row from "../../../layouts/Row";

const AdminTrainingLog = () => {
  const { trainings, refreshTraining } = useTrainings();

  useEffect(() => {
    refreshTraining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormContainer title="훈련일지 관리">
      <Row justifyContent="space-between">
        <Link to="/admin/training/write">
          <NewArticleButton>새 글쓰기</NewArticleButton>
        </Link>
        <NewArticleButton onClick={() => refreshTraining()}>새로고침</NewArticleButton>
      </Row>
      <ListContainer datas={trainings} targetUrl={"/admin/training/"} additionalTitle={true} />
    </FormContainer>
  );
};

export default AdminTrainingLog;
