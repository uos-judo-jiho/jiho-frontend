import { createFileRoute } from "@tanstack/react-router";

import { EditPage } from "@/pages/my-page";

export const Route = createFileRoute("/_auth/mypage/edit")({
  staticData: { title: "정보 수정" },
  component: EditPage,
});
