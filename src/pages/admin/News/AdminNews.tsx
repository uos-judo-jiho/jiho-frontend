import { Link } from "react-router-dom";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { useNews } from "../../../recoills/news";
import { useEffect } from "react";
import Row from "../../../layouts/Row";

function AdminNews() {
  const { news, refreshNew } = useNews();
  const articles = news
    .map((newsData) => newsData.articles)
    .flat()
    .sort((a, b) => (a.id > b.id ? -1 : 1));

  useEffect(() => {
    refreshNew();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
}

export default AdminNews;
