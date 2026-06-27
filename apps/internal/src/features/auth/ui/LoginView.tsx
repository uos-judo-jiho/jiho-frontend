import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  apiErrorMessage,
  loginAdmin,
  type AdminProfile,
} from "@/features/auth/api/auth";

interface LoginViewProps {
  onLogin: (profile: AdminProfile) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => loginAdmin(email.trim(), password),
    onSuccess: onLogin,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    loginMutation.mutate();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
          UOS Judo Internal
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          로그인
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          하이라이트 처리와 서버 업로드를 위해 관리자 인증이 필요합니다.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              이메일
            </label>
            <input
              id="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일(아이디)"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {loginMutation.isError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {apiErrorMessage(
                loginMutation.error,
                "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={!email.trim() || !password || loginMutation.isPending}
            className="h-11 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loginMutation.isPending ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </section>
    </main>
  );
}
