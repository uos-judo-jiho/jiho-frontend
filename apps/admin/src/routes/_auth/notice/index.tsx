import { createFileRoute } from "@tanstack/react-router";

import Notice from "@/pages/Notice/Notice";
import { requireRole, StaffAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/notice/")({
  beforeLoad: ({ context }) => requireRole(context.me, StaffAndAbove),
  staticData: { title: "공지사항" },
  component: Notice,
});
