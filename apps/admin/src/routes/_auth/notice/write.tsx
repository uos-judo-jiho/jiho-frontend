import { createFileRoute } from "@tanstack/react-router";

import WriteArticlePage from "@/pages/WriteArticlePage";
import { requireRole, StaffAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/notice/write")({
  beforeLoad: ({ context }) => requireRole(context.me, StaffAndAbove),
  staticData: { title: "공지사항 작성" },
  component: WriteArticlePage,
});
