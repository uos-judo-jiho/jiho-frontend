import { useEffect, useState } from "react";
import useFetchData from "../../../Hooks/useFetchData";
import { getNews } from "../../../api/newsApi";
import FormContainer from "../../../components/admin/form/FormContainer";
import ListContainer from "../../../layouts/ListContainer";
import { NewsType } from "../../../types/NewsType";
import { Link } from "react-router-dom";

function AdminNews() {
  const [news, setNews] = useState<NewsType>();
  const { loading, error, response } = useFetchData(getNews, "2022");

  useEffect(() => {
    setNews(response);
  }, [loading, error, response]);

  if (!news) return null;
  function handleNewArticle(event: React.MouseEvent<HTMLButtonElement>) {}
  return (
    <FormContainer title="지호지 관리">
      <Link to="/admin/news/write">
        <button onClick={handleNewArticle}>새 글쓰기</button>
      </Link>
      <ListContainer
        datas={news.articles}
        targetUrl={"/admin/news/"}
      ></ListContainer>
    </FormContainer>
  );
}

export default AdminNews;
