import { Link } from "react-router-dom";
import FormContainer from "../../../components/admin/form/FormContainer";
import { NewArticleButton } from "../../../components/admin/form/StyledComponent/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { useNews } from "../../../recoills/news";

function AdminNews() {
  const { news } = useNews();

  function handleNewArticle(event: React.MouseEvent<HTMLButtonElement>) {}
  return (
    <FormContainer title="지호지 관리">
      <Link to="/admin/news/write">
        <NewArticleButton onClick={handleNewArticle}>
          새 글쓰기
        </NewArticleButton>
      </Link>
      <ListContainer
        datas={news.articles}
        targetUrl={"/admin/news/"}
        additionalTitle={true}
      ></ListContainer>
    </FormContainer>
  );
}

export default AdminNews;
