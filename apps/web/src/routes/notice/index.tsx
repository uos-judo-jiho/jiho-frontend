import { createFileRoute } from "@tanstack/react-router";

import Notice from "@/pages/Notice/Notice";

import { seoHead } from "@/features/seo/head";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/notice/")({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        v2Api.getGetApiV2NoticesQueryOptions(),
      );
    } catch (error) {
      console.error("[SSR] Notices prefetch error:", error);
    }
  },
  head: () =>
    seoHead({
      title: "Notice",
      pathname: "/notice",
    }),
  component: Notice,
});
