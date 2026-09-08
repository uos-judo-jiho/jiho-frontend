import { createFileRoute } from "@tanstack/react-router";

import { NewsIndexPage } from "@/pages/news/news-index-page";

import { newsArchiveQueryOptions } from "@/features/news";
import { createImageGalleryData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";

const FALLBACK_DESCRIPTION = "서울시립대학교 유도부 지호지 - 뉴스 및 소식";

export const Route = createFileRoute("/news/")({
  // 연도 수만큼 목록을 부르던 것이 아카이브 호출 하나가 됐다 (api#41).
  // __root 가 이미 같은 쿼리를 채워 두므로 여기서는 캐시를 읽기만 한다.
  loader: async ({ context }): Promise<Omit<SeoHeadOptions, "title">> => {
    try {
      const response = await context.queryClient.ensureQueryData(
        newsArchiveQueryOptions(),
      );
      const years = response.data.years;
      const firstArticle = years.at(0)?.articles.at(0);

      const description = firstArticle
        ? [firstArticle.title, firstArticle.excerpt].join(" | ")
        : FALLBACK_DESCRIPTION;

      const structuredData = createImageGalleryData({
        name: "서울시립대학교 유도부 지호지",
        description,
        url: "https://uosjudo.com/news",
        images: years.flatMap(({ year, articles }) => {
          const article = articles.at(0);
          if (!article) {
            return [];
          }
          return [
            {
              url: article.thumbnail?.originSrc || "",
              caption: `${year}년 - ${article.title}`,
              datePublished: article.dateTime
                ? new Date(article.dateTime).toISOString()
                : undefined,
            },
          ];
        }),
      });

      return {
        description,
        imgUrl: firstArticle?.thumbnail?.originSrc,
        structuredData,
      };
    } catch (error) {
      console.error("[SSR] News archive prefetch error:", error);
      return { description: FALLBACK_DESCRIPTION };
    }
  },
  head: ({ loaderData }) =>
    seoHead({
      title: "News",
      pathname: "/news",
      ...loaderData,
    }),
  component: NewsIndexPage,
});
