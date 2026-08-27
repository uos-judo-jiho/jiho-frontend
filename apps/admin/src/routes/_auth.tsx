import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";

import Loading from "@/components/common/Skeletons/Loading";
import { AuthenticatedLayout } from "@/components/layouts/AuthenticatedLayout";
import { ensureMe } from "@/shared/auth/ensure-me";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    const me = await ensureMe(context.queryClient);

    if (!me) {
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    }

    // 자식 라우트의 beforeLoad 가 context.me 로 권한을 확인한다.
    return { me };
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <AuthenticatedLayout>
      {/* 페이지들이 useSuspenseQuery 를 쓰므로 경계가 필요하다
          (기존 ProtectedRoute 가 감싸주던 자리) */}
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </AuthenticatedLayout>
  );
}
