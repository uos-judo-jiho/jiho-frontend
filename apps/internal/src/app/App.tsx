import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  apiErrorMessage,
  getAdminSession,
  logoutAdmin,
  type AdminProfile,
} from "@/features/auth/api/auth";
import LoginView from "@/features/auth/ui/LoginView";
import { UploaderPage } from "@/pages/UploaderPage";

const SESSION_QUERY_KEY = ["admin-session"] as const;

export default function App() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: getAdminSession,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () =>
      queryClient.setQueryData<AdminProfile | null>(SESSION_QUERY_KEY, null),
    onError: (error) =>
      toast.error(apiErrorMessage(error, "로그아웃에 실패했습니다.")),
  });

  if (sessionQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        관리자 세션을 확인하고 있습니다…
      </main>
    );
  }

  if (sessionQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <section className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-700">
            {apiErrorMessage(
              sessionQuery.error,
              "관리자 세션을 확인하지 못했습니다.",
            )}
          </p>
          <button
            type="button"
            onClick={() => sessionQuery.refetch()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            다시 시도
          </button>
        </section>
      </main>
    );
  }

  if (!sessionQuery.data) {
    return (
      <LoginView
        onLogin={(profile) =>
          queryClient.setQueryData(SESSION_QUERY_KEY, profile)
        }
      />
    );
  }

  const profile = sessionQuery.data;
  const userName = profile.user.additionalInfo?.name || profile.user.email;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              UOS Judo
            </p>
            <h1 className="mt-1 text-lg font-bold">하이라이트 업로더</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-700">{userName}</p>
              <p className="text-xs uppercase text-slate-400">
                {profile.user.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <UploaderPage />
    </div>
  );
}
