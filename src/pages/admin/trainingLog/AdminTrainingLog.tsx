import { useTrainings } from "@/recoills/tranings";
import { Link } from "react-router-dom";
import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";

const AdminTrainingLog = () => {
  const { trainings, refetch: refreshTraining } = useTrainings();

  return (
    <FormContainer title="훈련일지 관리">
      <Row justifyContent="space-between">
        <Link to="/admin/training/write">
          <NewArticleButton>새 글쓰기</NewArticleButton>
        </Link>
        <NewArticleButton onClick={() => refreshTraining()}>
          새로고침
        </NewArticleButton>
      </Row>
      <ListContainer
        datas={trainings ?? []}
        targetUrl={"/admin/training/"}
        additionalTitle={true}
      />
    </FormContainer>
  );
};

export default AdminTrainingLog;
