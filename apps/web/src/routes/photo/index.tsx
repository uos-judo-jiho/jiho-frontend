import { createFileRoute } from "@tanstack/react-router";

import { TrainingIndexPage } from "@/pages/training/training-index-page";

import { boardListInfiniteQueryOptions } from "@/features/content";
import { createImageGalleryData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";

const FALLBACK_DESCRIPTION = "서울시립대학교 유도부 지호 - 훈련일지";

export const Route = createFileRoute("/photo/")({
  loader: async ({ context }): Promise<Omit<SeoHeadOptions, "title">> => {
    try {
      // 목록은 서버가 최신순으로 페이지 단위로 준다 (api#41) — 첫 페이지만
      // 프리페치하면 화면과 SEO 모두 필요한 만큼을 얻는다.
      const list = await context.queryClient.ensureInfiniteQueryData(
        boardListInfiniteQueryOptions({ type: "training" }),
      );
      const trainings = list.pages.flatMap((page) => page.data.items);
      const latest = trainings.at(0);

      const description = latest
        ? [latest.title, latest.excerpt].filter(Boolean).join(" | ")
        : FALLBACK_DESCRIPTION;

      const structuredData =
        trainings.length > 0
          ? createImageGalleryData({
              name: "서울시립대학교 유도부 지호 훈련일지",
              description,
              url: "https://uosjudo.com/photo",
              images: trainings.slice(0, 20).map((training) => ({
                url: training.thumbnail?.originSrc || "",
                caption: training.title,
                datePublished: training.dateTime
                  ? new Date(training.dateTime).toISOString()
                  : undefined,
              })),
            })
          : null;

      return {
        description,
        imgUrl: latest?.thumbnail?.originSrc,
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
