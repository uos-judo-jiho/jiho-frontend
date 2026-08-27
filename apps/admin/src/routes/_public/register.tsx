import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { Register } from "@/features/auth/register";
import { ensureMe } from "@/shared/auth/ensure-me";
import { resolveRedirectUrl } from "@/shared/auth/redirect-url";

const registerSearchSchema = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/_public/register")({
  validateSearch: (search: Record<string, unknown>) =>
    registerSearchSchema.parse(search),
  beforeLoad: async ({ context, search }) => {
    const me = await ensureMe(context.queryClient);

    if (me) {
      throw redirect({ href: resolveRedirectUrl(search.redirectTo) });
    }
  },
  staticData: { title: "회원가입" },
  component: Register,
});
