import { createFileRoute } from "@tanstack/react-router";

import NewsDetailPage from "@/pages/News/NewsDetailPage";

import { createArticleData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/news/$id/$newsId")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title"> & { title?: string }> => {
    const year = Number(params.id);
    const articleId = Number(params.newsId);

    try {
      // PC(단건)와 모바일(연도 전체)이 서로 다른 쿼리를 사용하므로 둘 다 프리페치
      const [articleResponse] = await Promise.all([
        context.queryClient.ensureQueryData(
          v2Api.getGetApiV2NewsYearIdQueryOptions(year, articleId),
        ),
        context.queryClient.ensureQueryData(
          v2Api.getGetApiV2NewsYearQueryOptions(year),
        ),
      ]);

      const article = articleResponse.data.article;

      if (!article) {
        return {};
      }

      const description = [
        article.title,
        article.description?.slice(0, 140),
      ].join(" | ");

      const publishedDate = article.dateTime
        ? new Date(article.dateTime).toISOString()
        : undefined;

      const structuredData = createArticleData({
        headline: `${year}년 지호지 - ${article.title}`,
        description,
        images: article.images.map((img) => img.originSrc),
        datePublished: publishedDate,
        dateModified: publishedDate,
        author: article.author,
      });

      return {
        title: `${year}년 지호지 - ${article.title}`,
        description,
        imgUrl: article.images.at(0)?.originSrc,
        articleType: "article",
        datePublished: publishedDate,
        dateModified: publishedDate,
        author: article.author ?? "",
        structuredData,
      };
    } catch (error) {
      console.error("[SSR] News article prefetch error:", error);
      return {};
    }
  },
  head: ({ loaderData, params }) =>
    seoHead({
      title: loaderData?.title ?? `${params.id}년 지호지`,
      pathname: `/news/${params.id}/${params.newsId}`,
      ...loaderData,
    }),
  component: NewsDetailPage,
});
