import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/pages/home-page";

export const Route = createFileRoute("/_auth/")({
  staticData: { title: "홈" },
  component: HomePage,
});
