import { createFileRoute } from "@tanstack/react-router";

import NewsIndex from "@/pages/News/NewsIndex";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/news/")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "지호지" },
  component: NewsIndex,
});
