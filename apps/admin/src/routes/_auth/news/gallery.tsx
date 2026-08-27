import { createFileRoute } from "@tanstack/react-router";

import { GalleryList } from "@/pages/News/Gallery/GalleryList";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/news/gallery")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "지호지 갤러리" },
  component: GalleryList,
});
