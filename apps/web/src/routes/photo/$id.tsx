import { createFileRoute } from "@tanstack/react-router";

import { TrainingDetailPage } from "@/pages/training/training-detail-page";

import { createArticleData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/photo/$id")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title"> & { title?: string }> => {
    try {
      const response = await context.queryClient.ensureQueryData(
        v2Api.getListTrainingLogsQueryOptions(),
      );
      const trainings = response.data.trainingLogs ?? [];
      const info = trainings.find(
        (item) => item.id.toString() === params.id.toString(),
      );

      if (!info) {
        return {};
      }

      const description = [info.title, info.description.slice(0, 140)].join(
        " | ",
      );

      const publishedDate = info.dateTime
        ? new Date(info.dateTime).toISOString()
        : undefined;

      const structuredData = createArticleData({
        headline: [info.title, info.author].join(" - ") || "",
        description,
        images: info.images.map((img) => img.originSrc),
        datePublished: publishedDate,
        dateModified: publishedDate,
      });

      return {
        title: `훈련일지 - ${info.author}`,
        description,
        imgUrl: info.images.at(0)?.originSrc,
        articleType: "article",
        datePublished: publishedDate,
        dateModified: publishedDate,
        author: info.author,
        structuredData,
      };
    } catch (error) {
      console.error("[SSR] Training detail prefetch error:", error);
      return {};
    }
  },
  head: ({ loaderData, params }) =>
    seoHead({
      title: loaderData?.title ?? "훈련일지",
      pathname: `/photo/${params.id}`,
      ...loaderData,
    }),
  component: TrainingDetailPage,
});
