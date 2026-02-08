import { queryClient } from "@/shared/context/QueryClient";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { NewsType } from "@/shared/lib/types/NewsType";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v1Api } from "@packages/api";
import { v1ApiModel } from "@packages/api/model";
import { useMemo } from "react";

const normalizeNewsResponse = (
  response: v1ApiModel.GetApiV1NewsYearResponse | undefined,
  year: string,
): NewsType | null => {
  if (!response || typeof response !== "object") {
    return null;
  }

  const articles = (response.articles ?? []).map<ArticleInfoType>(
    (article) => ({
      id: String(article.id),
      imgSrcs: article.imgSrcs ?? [],
      title: article.title ?? "",
      author: article.author ?? "",
      dateTime: article.dateTime ?? "",
      tags: article.tags ?? [],
      description: article.description ?? "",
    }),
  );

  return {
    year: String(response.year ?? year),
    articles,
    images: response.images ?? [],
  };
};

export const useAllNewsQuery = () => {
  const years = useMemo(() => vaildNewsYearList(), []);

  const promises = years.map(async (year) => {
    const numericYear = Number(year);
    const options = v1Api.getGetApiV1NewsYearQueryOptions(numericYear, {
      query: {
        select: (response) => response.data,
      },
    });

    const data = await queryClient.fetchQuery(options);

    return normalizeNewsResponse(data, year);
  });

  return Promise.all(promises).then((news) =>
    news
      .filter((item): item is NewsType => Boolean(item))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year)),
  );
};
