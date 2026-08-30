import { createFileRoute } from "@tanstack/react-router";

import { UserDetailPage } from "@/pages/user/detail";
import { requireRole, StaffAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/users/$id")({
  beforeLoad: ({ context }) => requireRole(context.me, StaffAndAbove),
  staticData: { title: "회원 상세" },
  component: UserDetailPage,
});
