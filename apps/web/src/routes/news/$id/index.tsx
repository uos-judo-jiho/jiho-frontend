import { createFileRoute, notFound } from "@tanstack/react-router";

import NewsYear from "@/pages/News/NewsYear";

import { createImageGalleryData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/news/$id/")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title">> => {
    const { id } = params;

    if (!vaildNewsYearList().includes(id)) {
      throw notFound();
    }

    const fallbackDescription = `${id}년 서울시립대학교 유도부 지호지`;

    try {
      const response = await context.queryClient.ensureQueryData(
        v2Api.getGetApiV2NewsYearQueryOptions(Number(id)),
      );
      const news = response.data;

      const description = [
        news.year,
        news.articles.at(0)?.title,
        news.articles.at(0)?.description.slice(0, 140),
      ].join(" | ");

      const allImages = news.articles.flatMap((article) =>
        article.images.slice(0, 5).map((imgSrc, imgIdx) => ({
          url: imgSrc.originSrc,
          caption: `${article.title} - ${imgIdx + 1}`,
          datePublished: article.dateTime
            ? new Date(article.dateTime).toISOString()
            : undefined,
        })),
      );

      const structuredData =
        news.articles.length > 0
          ? createImageGalleryData({
              name: `${id}년 서울시립대학교 유도부 지호지`,
              description,
              url: `https://uosjudo.com/news/${id}`,
              images: allImages,
            })
          : null;

      return {
        description,
        imgUrl: news.articles.at(0)?.images.at(0)?.originSrc,
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
  component: NewsYear,
});
