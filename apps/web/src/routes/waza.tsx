import { createFileRoute } from "@tanstack/react-router";

import { WazaPage } from "@/pages/waza";

import { seoHead } from "@/features/seo/head";

export const Route = createFileRoute("/waza")({
  head: () =>
    seoHead({
      title: "waza",
      pathname: "/waza",
    }),
  component: WazaPage,
});
