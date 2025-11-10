import { Link, useParams, useNavigate } from "react-router-dom";
import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import { useNewsQuery } from "@/api/news/query";
import Loading from "@/components/common/Skeletons/Loading";

const AdminNews = () => {
  const navigate = useNavigate();
  const { year } = useParams<{ year: string }>();
  const {
    data: newsData,
    refetch,
    isLoading,
    isRefetching,
  } = useNewsQuery(year || "2025");

  const isDataLoading = isLoading || isRefetching;

  const articles = newsData?.articles || [];

  return (
    <FormContainer title={`지호지 관리 (${year}년)`}>
      <Row justifyContent="space-between" style={{ marginBottom: "12px" }}>
        <button
          onClick={() => navigate("/admin/news")}
          className="px-4 py-2 bg-transparent border border-gray-500 rounded cursor-pointer text-sm transition-all hover:bg-gray-200"
        >
          ← 년도 선택으로 돌아가기
        </button>
      </Row>
      <Row justifyContent="space-between">
        <Row gap={12} style={{ width: "auto" }}>
          <Link to={`/admin/news/${year}/write`}>
            <NewArticleButton>새 글쓰기</NewArticleButton>
          </Link>
          <Link to={`/admin/news/${year}/gallery`}>
            <NewArticleButton>{year}년 갤러리 보기</NewArticleButton>
          </Link>
        </Row>
        <NewArticleButton onClick={() => refetch()}>새로고침</NewArticleButton>
      </Row>
      {isDataLoading ? (
        <Loading />
      ) : (
        <ListContainer
          datas={articles}
          targetUrl={`/admin/news/${year}/`}
          additionalTitle={true}
        />
      )}
    </FormContainer>
  );
};

export default AdminNews;
