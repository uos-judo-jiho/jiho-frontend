import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { VideoLabelingFullpage } from "@/pages/video/fullpage/detail";
import { requireRole, VideoLabelingRoles } from "@/shared/auth/roles";

const searchSchema = z.object({
  /** 현재 보고 있는 하이라이트. 목록/이웃 클립 이동 시 함께 옮겨간다. */
  highlightId: z.coerce.number().optional(),
});

export const Route = createFileRoute("/_auth/videos/fullpage/$jobId")({
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: ({ context }) => requireRole(context.me, VideoLabelingRoles),
  staticData: { title: "하이라이트 전체화면" },
  component: VideoLabelingFullpage,
});
