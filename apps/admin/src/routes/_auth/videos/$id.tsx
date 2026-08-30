import { createFileRoute } from "@tanstack/react-router";

import { VideoLabelingDetailPage } from "@/pages/video/detail";
import { requireRole, VideoLabelingRoles } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/videos/$id")({
  beforeLoad: ({ context }) => requireRole(context.me, VideoLabelingRoles),
  staticData: { title: "영상 라벨링" },
  component: VideoLabelingDetailPage,
});
