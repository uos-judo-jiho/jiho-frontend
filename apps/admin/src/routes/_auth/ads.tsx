import { createFileRoute } from "@tanstack/react-router";

import { AdsPage } from "@/pages/ads-page";
import { RootOnly, requireRole } from "@/shared/auth/roles";

export const Route = createFileRoute("/_auth/ads")({
  // 사이드바·커맨드 팔레트(`components/admin/Main/menu.ts`)도 같은 RootOnly 를
  // 읽는다 — 한쪽만 고쳐서 "메뉴에는 보이는데 들어가면 튕기는" 상태가 되지 않게.
  // 서버도 requireRole(["root"]) 로 같은 조건을 걸고 있다.
  beforeLoad: ({ context }) => requireRole(context.me, RootOnly),
  staticData: { title: "제휴 광고" },
  component: AdsPage,
});
