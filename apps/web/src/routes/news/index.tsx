import { createFileRoute } from "@tanstack/react-router";

import NewsPage from "@/pages/News/News";

import { createImageGalleryData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";

const FALLBACK_DESCRIPTION = "서울시립대학교 유도부 지호지 - 뉴스 및 소식";

export const Route = createFileRoute("/news/")({
  loader: async ({ context }): Promise<Omit<SeoHeadOptions, "title">> => {
    try {
      const allNews = await Promise.all(
        vaildNewsYearList()
          .reverse()
          .map((year) =>
            context.queryClient.ensureQueryData(
              v2Api.getGetApiV2NewsYearQueryOptions(Number(year), { limit: 2 }),
            ),
          ),
      );
      const newsByYear = allNews.map((response) => response.data);
      const firstArticle = newsByYear.at(0)?.articles.at(0);

      const description = firstArticle
        ? [firstArticle.title, firstArticle.description.slice(0, 140)].join(
            " | ",
          )
        : FALLBACK_DESCRIPTION;

      const structuredData = createImageGalleryData({
        name: "서울시립대학교 유도부 지호지",
        description,
        url: "https://uosjudo.com/news",
        images: newsByYear.flatMap((news) => {
          const article = news.articles.at(0);
          if (!article) {
            return [];
          }
          return [
            {
              url: article.images[0]?.originSrc || "",
              caption: `${news.year}년 - ${article.title}`,
              datePublished: article.dateTime
                ? new Date(article.dateTime).toISOString()
                : undefined,
            },
          ];
        }),
      });

      return {
        description,
        imgUrl: firstArticle?.images.at(0)?.originSrc,
        structuredData,
      };
    } catch (error) {
      console.error("[SSR] News prefetch error:", error);
      return { description: FALLBACK_DESCRIPTION };
    }
  },
  head: ({ loaderData }) =>
    seoHead({
      title: "News",
      pathname: "/news",
      ...loaderData,
    }),
  component: NewsPage,
});
