import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { NewsType } from "@/shared/lib/types/NewsType";
import { v2ApiModel } from "@packages/api/model";

export const normalizeNewsResponse = (
  response: v2ApiModel.GetApiV2NewsYearResponse | undefined,
  fallbackYear: string,
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
    year: String(response.year ?? fallbackYear),
    images: response.images ?? [],
    articles,
  };
};
