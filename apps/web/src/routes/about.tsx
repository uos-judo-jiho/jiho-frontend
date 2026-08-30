import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/pages/about-page";

import { seoHead } from "@/features/seo/head";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        v2Api.getGetApiV2AwardsQueryOptions(),
      );
    } catch (error) {
      console.error("[SSR] Awards prefetch error:", error);
    }
  },
  head: () =>
    seoHead({
      title: "About",
      pathname: "/about",
    }),
  component: AboutPage,
});
