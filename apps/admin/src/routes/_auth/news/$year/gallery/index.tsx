import { createFileRoute } from "@tanstack/react-router";

import Gallery from "@/pages/News/Gallery/Gallery";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/news/$year/gallery/")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "지호지 갤러리 상세" },
  component: Gallery,
});
