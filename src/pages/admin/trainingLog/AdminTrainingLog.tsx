import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import Loading from "@/components/common/Skeletons/Loading";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import { useTrainingListQuery } from "@/features/api/trainings/query";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const AdminTrainingLog = () => {
  const {
    data,
    refetch: refreshTraining,
    isLoading,
    isRefetching,
  } = useTrainingListQuery();

  const isDataLoading = isLoading || isRefetching;

  // 날짜순 정렬
  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

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
      {isDataLoading ? (
        <Loading loading={isDataLoading} />
      ) : (
        <ListContainer
          datas={trainings ?? []}
          targetUrl={"/admin/training/"}
          additionalTitle={true}
        />
      )}
    </FormContainer>
  );
};

export default AdminTrainingLog;
