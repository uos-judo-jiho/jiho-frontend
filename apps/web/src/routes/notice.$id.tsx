import { createFileRoute } from "@tanstack/react-router";

import NoticeDetail from "@/pages/Notice/NoticeDetail";

import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/notice/$id")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title">> => {
    try {
      const response = await context.queryClient.ensureQueryData(
        v2Api.getGetApiV2NoticesQueryOptions(),
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
        imgUrl: data.images[0],
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
  component: NoticeDetail,
});
