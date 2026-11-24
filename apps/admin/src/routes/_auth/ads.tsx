import { createFileRoute } from "@tanstack/react-router";

import { AdsPage } from "@/pages/ads-page";
import { requireRole } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/ads")({
  // 광고는 수수료 수익과 표시 의무가 걸린 데이터라 root 만 다룬다.
  // 서버도 requireRole(["root"]) 로 같은 조건을 걸고 있다.
  beforeLoad: ({ context }) => requireRole(context.me, ["root"]),
  staticData: { title: "제휴 광고" },
  component: AdsPage,
});
