import { useParams } from "react-router-dom";
import NewsForm from "../../../components/admin/form/NewsForm";
import { useEffect, useState } from "react";
import { NewsType } from "../../../types/NewsType";
import useFetchData from "../../../Hooks/useFetchData";
import { getNews } from "../../../api/newsApi";
import { ArticleInfoType } from "../../../types/ArticleInfoType";
import Title from "../../../layouts/Title";
import { Constants } from "../../../constant/constant";

function AdminNewsDetail() {
  const { id } = useParams();

  const [news, setNews] = useState<NewsType>();
  const [article, setArticle] = useState<ArticleInfoType>();
  const { loading, error, response } = useFetchData(getNews, "2022");

  useEffect(() => {
    const newNews = response as NewsType;
    setNews(newNews);
  }, [loading, error, response]);

  useEffect(() => {
    const targetArticle = news?.articles.find(
      (item) => item.id.toString() === id
    );
    setArticle(targetArticle);
  }, [news]);

  if (!news || !article) return null;

  return (
    <>
      <Title title={"지호지 수정"} color={Constants.BLACK_COLOR} />
      <NewsForm data={article} />;
    </>
  );
}

export default AdminNewsDetail;
