import { createFileRoute, notFound } from "@tanstack/react-router";

import { NewsYearPage } from "@/pages/news/news-year-page";

import { boardListInfiniteQueryOptions } from "@/features/content";
import { newsArchiveQueryOptions } from "@/features/news";
import { createImageGalleryData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";

export const Route = createFileRoute("/news/$id/")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title">> => {
    const { id } = params;
    const year = Number(id);

    if (!/^\d{4}$/.test(id)) {
      throw notFound();
    }

    // 어떤 연도가 실제로 있는지는 서버가 안다 — 프론트가 시작 연도를 상수로
    // 들고 있을 이유가 없어졌다 (api#41).
    const archive = await context.queryClient.ensureQueryData(
      newsArchiveQueryOptions(),
    );
    if (!archive.data.years.some((entry) => entry.year === year)) {
      throw notFound();
    }

    const fallbackDescription = `${id}년 서울시립대학교 유도부 지호지`;

    try {
      const list = await context.queryClient.ensureInfiniteQueryData(
        boardListInfiniteQueryOptions({ type: "news", year }),
      );
      const articles = list.pages.flatMap((page) => page.data.items);
      const firstArticle = articles.at(0);

      const description = [id, firstArticle?.title, firstArticle?.excerpt]
        .filter(Boolean)
        .join(" | ");

      const structuredData =
        articles.length > 0
          ? createImageGalleryData({
              name: `${id}년 서울시립대학교 유도부 지호지`,
              description,
              url: `https://uosjudo.com/news/${id}`,
              images: articles.flatMap((article) =>
                article.thumbnail
                  ? [
                      {
                        url: article.thumbnail.originSrc,
                        caption: article.title,
                        datePublished: article.dateTime
                          ? new Date(article.dateTime).toISOString()
                          : undefined,
                      },
                    ]
                  : [],
              ),
            })
          : null;

      return {
        description,
        imgUrl: firstArticle?.thumbnail?.originSrc,
        structuredData,
      };
    } catch (error) {
      console.error("[SSR] News year prefetch error:", error);
      return { description: fallbackDescription };
    }
  },
  head: ({ loaderData, params }) =>
    seoHead({
      title: "News",
      pathname: `/news/${params.id}`,
      ...loaderData,
    }),
  component: NewsYearPage,
});
