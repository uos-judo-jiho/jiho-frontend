import { createFileRoute } from "@tanstack/react-router";

import { UserPage } from "@/pages/user";
import { requireRole, StaffAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/users/")({
  beforeLoad: ({ context }) => requireRole(context.me, StaffAndAbove),
  staticData: { title: "회원 관리" },
  component: UserPage,
});
