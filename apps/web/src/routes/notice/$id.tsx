import { createFileRoute } from "@tanstack/react-router";

import { NoticeDetailPage } from "@/pages/notice/notice-detail-page";

import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { v2Api } from "@packages/api";

/** 공지 이미지가 문자열 URL 또는 {originSrc} 객체 어느 쪽이어도 URL 을 뽑아낸다 */
const extractImageUrl = (image: unknown): string | undefined => {
  if (typeof image === "string") {
    return image;
  }
  if (
    image &&
    typeof image === "object" &&
    "originSrc" in image &&
    typeof (image as { originSrc?: unknown }).originSrc === "string"
  ) {
    return (image as { originSrc: string }).originSrc;
  }
  return undefined;
};

export const Route = createFileRoute("/notice/$id")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title">> => {
    try {
      const response = await context.queryClient.ensureQueryData(
        v2Api.getListNoticesQueryOptions(),
      );
      const notices = response.data.notices ?? [];
      const data = notices.find(
        (value) => value.id.toString() === params.id.toString(),
      );

      if (!data) {
        return {};
      }

      return {
        description: [data.title, data.description.slice(0, 140)].join(" | "),
        imgUrl: extractImageUrl(data.images[0]),
      };
    } catch (error) {
      console.error("[SSR] Notice detail prefetch error:", error);
      return {};
    }
  },
  head: ({ loaderData, params }) =>
    seoHead({
      title: "Notice",
      pathname: `/notice/${params.id}`,
      ...loaderData,
    }),
  component: NoticeDetailPage,
});
