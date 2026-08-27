import { createFileRoute } from "@tanstack/react-router";

import WriteArticlePage from "@/pages/WriteArticlePage";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/news/$year/write")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "지호지 작성" },
  component: WriteArticlePage,
});
