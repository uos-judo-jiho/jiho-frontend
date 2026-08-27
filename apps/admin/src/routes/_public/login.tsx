import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { LoginPage } from "@/features/auth/login";
import { ensureMe } from "@/shared/auth/ensure-me";
import { resolveRedirectUrl } from "@/shared/auth/redirect-url";

const loginSearchSchema = z.object({
  redirectTo: z.string().optional(),
  /** 세션이 만료돼 밀려난 경우 붙는 플래그 */
  expired: z.string().optional(),
});

export const Route = createFileRoute("/_public/login")({
  validateSearch: (search: Record<string, unknown>) =>
    loginSearchSchema.parse(search),
  beforeLoad: async ({ context, search }) => {
    // 이미 로그인한 유저가 /login 으로 오면 redirectTo (없으면 홈) 로 돌려보낸다.
    const me = await ensureMe(context.queryClient);

    if (me) {
      throw redirect({ href: resolveRedirectUrl(search.redirectTo) });
    }
  },
  staticData: { title: "로그인" },
  component: LoginRoute,
});

function LoginRoute() {
  const { redirectTo } = Route.useSearch();

  return <LoginPage redirectTo={redirectTo} />;
}
