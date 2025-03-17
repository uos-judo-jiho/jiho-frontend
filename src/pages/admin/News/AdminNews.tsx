import { useEffect } from "react";
import { Link } from "react-router-dom";
import FormContainer from "@/components/admin/form/FormContainer";
import { NewArticleButton } from "@/components/admin/form/StyledComponent/FormContainer";
import ListContainer from "@/components/layouts/ListContainer";
import Row from "@/components/layouts/Row";
import { useNews } from "@/recoils/news";

const AdminNews = () => {
  const { news, refreshNew } = useNews();
  const articles = news
    .flatMap((newsData) => newsData.articles)
    .sort((a, b) => (a.id > b.id ? -1 : 1));

  useEffect(() => {
    refreshNew();
  }, [refreshNew]);

  return (
    <FormContainer title="지호지 관리">
      <Row justifyContent="space-between">
        <Row gap={12} style={{ width: "auto" }}>
          <Link to="/admin/news/write">
            <NewArticleButton>새 글쓰기</NewArticleButton>
          </Link>
          <Link to="/admin/news/gallery">
            <NewArticleButton>년도별 갤러리 보기</NewArticleButton>
          </Link>
        </Row>
        <NewArticleButton onClick={() => refreshNew()}>
          새로고침
        </NewArticleButton>
      </Row>
      <ListContainer
        datas={articles}
        targetUrl={"/admin/news/"}
        additionalTitle={true}
      ></ListContainer>
    </FormContainer>
  );
};

export default AdminNews;
