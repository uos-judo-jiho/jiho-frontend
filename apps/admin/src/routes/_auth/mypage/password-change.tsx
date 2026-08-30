import { createFileRoute } from "@tanstack/react-router";

import { PasswordChangePage } from "@/pages/my-page/password-chage-page";

export const Route = createFileRoute("/_auth/mypage/password-change")({
  staticData: { title: "비밀번호 변경" },
  component: PasswordChangePage,
});
