import { createFileRoute } from "@tanstack/react-router";

import { Awards } from "@/pages/Awards";
import { requireRole, StaffAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/awards")({
  beforeLoad: ({ context }) => requireRole(context.me, StaffAndAbove),
  staticData: { title: "수상내역" },
  component: Awards,
});
