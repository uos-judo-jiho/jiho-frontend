import { createFileRoute } from "@tanstack/react-router";

import {
  ALBUM_PREVIEW_PER_YEAR,
  ALBUM_YEAR_LIMIT,
  AlbumPage,
} from "@/pages/album-page";

import { seoHead } from "@/features/seo/head";
import { v2Api } from "@packages/api";

export const Route = createFileRoute("/album")({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        v2Api.getListGalleriesQueryOptions({
          limit: ALBUM_YEAR_LIMIT,
          perYear: ALBUM_PREVIEW_PER_YEAR,
        }),
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
