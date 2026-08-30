import NewsForm from "@/components/admin/form/NewsForm";
import { ReactionStatus } from "@/features/reaction";
import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { v2Api } from "@packages/api";
import { useMemo } from "react";
import { useParams } from "@tanstack/react-router";

const NewsDetail = () => {
  const { year, id } = useParams({ strict: false });

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

  return (
    <div className="flex flex-col gap-4">
      <ReactionStatus boardId={Number(article.id)} />
      <NewsForm data={article} />
    </div>
  );
};

export default NewsDetail;
