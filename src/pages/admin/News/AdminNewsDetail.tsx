import { useNewsQuery } from "@/api/news/query";
import NewsForm from "@/components/admin/form/NewsForm";
import Title from "@/components/layouts/Title";
import { Constants } from "@/lib/constant";
import { useParams } from "react-router-dom";

const AdminNewsDetail = () => {
  const { year, id } = useParams<{ year: string; id: string }>();

  const { data: newsData } = useNewsQuery(year);
  const article = newsData?.articles.find((item) => item.id.toString() === id);

  if (!article) return null;

  return (
    <>
      <Title title={"지호지 수정"} color={Constants.BLACK_COLOR} />
      <NewsForm data={article} />
    </>
  );
};

export default AdminNewsDetail;
