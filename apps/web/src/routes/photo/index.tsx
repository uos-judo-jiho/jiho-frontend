import { createFileRoute } from "@tanstack/react-router";

import { TrainingIndexPage } from "@/pages/training/training-index-page";

import { createImageGalleryData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { v2Api } from "@packages/api";

const FALLBACK_DESCRIPTION = "서울시립대학교 유도부 지호 - 훈련일지";

export const Route = createFileRoute("/photo/")({
  loader: async ({ context }): Promise<Omit<SeoHeadOptions, "title">> => {
    try {
      const response = await context.queryClient.ensureQueryData(
        v2Api.getGetApiV2TrainingsQueryOptions(),
      );
      const trainings = [...(response.data.trainingLogs ?? [])].sort((a, b) =>
        b.dateTime.localeCompare(a.dateTime),
      );

      const description = trainings.length
        ? [
            trainings.at(0)?.title,
            trainings.at(0)?.description.slice(0, 140),
          ].join(" | ")
        : FALLBACK_DESCRIPTION;

      const structuredData =
        trainings.length > 0
          ? createImageGalleryData({
              name: "서울시립대학교 유도부 지호 훈련일지",
              description,
              url: "https://uosjudo.com/photo",
              images: trainings.slice(0, 20).map((training) => ({
                url: training.images[0]?.originSrc || "",
                caption: training.title,
                datePublished: training.dateTime
                  ? new Date(training.dateTime).toISOString()
                  : undefined,
              })),
            })
          : null;

      return {
        description,
        imgUrl: trainings.at(0)?.images.at(0)?.originSrc,
        structuredData,
      };
    } catch (error) {
      console.error("[SSR] Trainings prefetch error:", error);
      return { description: FALLBACK_DESCRIPTION };
    }
  },
  head: ({ loaderData }) =>
    seoHead({
      title: "Photo",
      pathname: "/photo",
      ...loaderData,
    }),
  component: TrainingIndexPage,
});
