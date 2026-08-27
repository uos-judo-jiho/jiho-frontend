import { createFileRoute } from "@tanstack/react-router";

import NewsDetail from "@/pages/News/NewsDetail";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/news/$year/$id")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "지호지 상세" },
  component: NewsDetail,
});
