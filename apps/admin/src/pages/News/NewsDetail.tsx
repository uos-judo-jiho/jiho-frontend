import NewsForm from "@/components/admin/form/NewsForm";
import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { v2Api } from "@packages/api";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const NewsDetail = () => {
  const { year, id } = useParams<{ year: string; id: string }>();

  const { data: response } = v2Api.useGetApiV2NewsYear(
    Number(year),
    undefined,
    {
      query: {
        enabled: Boolean(year),
        select: (result) => result.data,
      },
    },
  );

  const newsData = useMemo(
    () => normalizeNewsResponse(response, year ?? ""),
    [response, year],
  );

  const article = newsData?.articles.find((item) => item.id.toString() === id);

  if (!article) return null;

  return <NewsForm data={article} />;
};

export default NewsDetail;
