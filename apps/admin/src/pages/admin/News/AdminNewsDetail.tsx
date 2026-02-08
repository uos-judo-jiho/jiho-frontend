import NewsForm from "@/components/admin/form/NewsForm";
import Title from "@/components/layouts/Title";
import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { Constants } from "@/shared/lib/constant";
import { v1Api } from "@packages/api";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const AdminNewsDetail = () => {
  const { year, id } = useParams<{ year: string; id: string }>();

  const { data: response } = v1Api.useGetApiV1NewsYear(Number(year), {
    query: {
      enabled: Boolean(year),
      select: (result) => result.data,
    },
  });

  const newsData = useMemo(
    () => normalizeNewsResponse(response, year ?? ""),
    [response, year],
  );

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
