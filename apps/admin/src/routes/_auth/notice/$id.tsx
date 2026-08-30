import { createFileRoute } from "@tanstack/react-router";

import { NoticeDetail } from "@/pages/Notice/NoticeDetail";
import { requireRole, StaffAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/notice/$id")({
  beforeLoad: ({ context }) => requireRole(context.me, StaffAndAbove),
  staticData: { title: "공지사항 상세" },
  component: NoticeDetail,
});
