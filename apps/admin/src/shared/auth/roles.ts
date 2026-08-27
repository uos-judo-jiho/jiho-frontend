import { redirect } from "@tanstack/react-router";

import type { Me } from "./ensure-me";

export const StaffAndAbove = ["root", "president", "manager", "staff"];
export const GeneralAndAbove = [...StaffAndAbove, "general"];
export const VideoLabelingRoles = [...GeneralAndAbove, "graduate"];

/**
 * 라우트 beforeLoad 에서 권한을 확인한다.
 * 권한이 없으면 홈으로 돌려보낸다 — 렌더 후 <Navigate> 가 아니라
 * 네비게이션 단계에서 막히므로 화면이 한 번 깜빡이지 않는다.
 */
export const requireRole = (me: Me, allowedRoles: string[]) => {
  const role = me.user.role;

  if (!role || !allowedRoles.includes(role)) {
    throw redirect({ to: "/" });
  }
};
