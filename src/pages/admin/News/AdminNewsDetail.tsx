import { useParams } from "react-router-dom";
import NewsForm from "../../../components/admin/form/NewsForm";
import { Constants } from "../../../constant/constant";
import Title from "../../../layouts/Title";
import { useNews } from "../../../recoills/news";
import { useEffect } from "react";

function AdminNewsDetail() {
  const { id } = useParams();

  const { news, fetch } = useNews();
  const article = news
    .find((newsData) =>
      newsData.articles.find((item) => item.id.toString() === id)
    )
    ?.articles.find((item) => item.id.toString() === id);

  useEffect(() => {
    (async () => {
      await fetch("2022");
      await fetch("2024");
    })();
  }, []);

  if (!news || !article) return null;

  return (
    <>
      <Title title={"지호지 수정"} color={Constants.BLACK_COLOR} />
      <NewsForm data={article} />;
    </>
  );
}

export default AdminNewsDetail;
