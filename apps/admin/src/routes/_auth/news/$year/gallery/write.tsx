import { createFileRoute } from "@tanstack/react-router";

import GalleryWrite from "@/pages/News/Gallery/GalleryWrite";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/news/$year/gallery/write")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "지호지 갤러리 작성" },
  component: GalleryWrite,
});
