import { createFileRoute } from "@tanstack/react-router";

import { TrainingLogPage } from "@/pages/training-log";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/training/")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "훈련일지" },
  component: TrainingLogPage,
});
