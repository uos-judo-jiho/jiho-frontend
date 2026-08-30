import { createFileRoute } from "@tanstack/react-router";

import { MyPage } from "@/pages/my-page";

export const Route = createFileRoute("/_auth/mypage/")({
  staticData: { title: "마이페이지" },
  component: MyPage,
});
