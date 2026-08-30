import { createFileRoute } from "@tanstack/react-router";

import NewsYear from "@/pages/News/NewsYear";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/news/$year/")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "지호지 년도별" },
  component: NewsYear,
});
