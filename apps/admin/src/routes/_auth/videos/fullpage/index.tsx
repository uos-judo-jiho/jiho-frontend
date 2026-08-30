import { createFileRoute } from "@tanstack/react-router";

import { VideoFullpageListPage } from "@/pages/video/fullpage";
import { requireRole, VideoLabelingRoles } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/videos/fullpage/")({
  beforeLoad: ({ context }) => requireRole(context.me, VideoLabelingRoles),
  staticData: { title: "하이라이트 전체화면" },
  component: VideoFullpageListPage,
});
