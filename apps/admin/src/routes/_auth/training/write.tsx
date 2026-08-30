import { createFileRoute } from "@tanstack/react-router";

import WriteArticlePage from "@/pages/WriteArticlePage";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/training/write")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "훈련일지 작성" },
  component: WriteArticlePage,
});
