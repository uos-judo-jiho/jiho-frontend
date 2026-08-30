import { createFileRoute } from "@tanstack/react-router";

import { AlbumPage } from "@/pages/album-page";

import { seoHead } from "@/features/seo/head";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/album")({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        v2Api.getGetApiV2NewsImagesAllQueryOptions(),
      );
    } catch (error) {
      console.error("[SSR] Album prefetch error:", error);
    }
  },
  head: () =>
    seoHead({
      title: "앨범",
      pathname: "/album",
    }),
  component: AlbumPage,
});
