import { createFileRoute } from "@tanstack/react-router";

import { NoticeIndexPage } from "@/pages/notice/notice-index-page";

import { boardListInfiniteQueryOptions } from "@/features/content";
import { seoHead } from "@/features/seo/head";

export const Route = createFileRoute("/notice/")({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureInfiniteQueryData(
        boardListInfiniteQueryOptions({ type: "notice" }),
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
  component: NoticeIndexPage,
});
