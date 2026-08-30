import { createFileRoute } from "@tanstack/react-router";

import { VideoLabelingPage } from "@/pages/video";
import { requireRole, VideoLabelingRoles } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/videos/")({
  beforeLoad: ({ context }) => requireRole(context.me, VideoLabelingRoles),
  staticData: { title: "하이라이트 라벨링" },
  component: VideoLabelingPage,
});
