import { createFileRoute } from "@tanstack/react-router";

import { TrainingLogDetail } from "@/pages/training-log/training-log-detail";
import { requireRole, GeneralAndAbove } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/training/$id")({
  beforeLoad: ({ context }) => requireRole(context.me, GeneralAndAbove),
  staticData: { title: "훈련일지 상세" },
  component: TrainingLogDetail,
});
