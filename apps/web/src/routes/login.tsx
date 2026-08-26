import { createFileRoute } from "@tanstack/react-router";

import Login from "@/pages/Login";

import { seoHead } from "@/features/seo/head";

type LoginSearch = {
  redirectTo?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirectTo:
      typeof search.redirectTo === "string" ? search.redirectTo : undefined,
  }),
  head: () =>
    seoHead({
      title: "로그인",
      pathname: "/login",
    }),
  component: Login,
});
