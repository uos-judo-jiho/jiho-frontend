import { useParams } from "react-router-dom";
import NewsForm from "@/components/admin/form/NewsForm";
import { Constants } from "@/lib/constant";
import Title from "@/components/layouts/Title";
import { useNews } from "@/recoils/news";
import { useEffect } from "react";

const AdminNewsDetail = () => {
  const { id } = useParams();

  const { news, refreshNew } = useNews();
  const article = news
    .find((newsData) =>
      newsData.articles.find((item) => item.id.toString() === id)
    )
    ?.articles.find((item) => item.id.toString() === id);

  useEffect(() => {
    refreshNew();
  }, [refreshNew]);

  if (!news || !article) return null;

  return (
    <>
      <Title title={"지호지 수정"} color={Constants.BLACK_COLOR} />
      <NewsForm data={article} />
    </>
  );
};

export default AdminNewsDetail;
