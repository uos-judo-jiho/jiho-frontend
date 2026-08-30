import { v2Admin } from "@packages/api";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { logger } from "@99mini/logger-client";

import { Button } from "@/shared/ui/primitives/button";
import { Input } from "@/shared/ui/primitives/input";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/login");

export const LoginPage = () => {
  const { redirectTo } = routeApi.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    logger.info("로그인", { path: window.location.pathname });
  }, []);

  const loginMutation = v2Admin.usePostApiV2AdminLogin({
    mutation: {
      onSuccess: () => {
        // 세션 쿠키를 반영하기 위해 전체 새로고침으로 이동한다
        window.location.href = redirectTo ? decodeURIComponent(redirectTo) : "/";
      },
      onError: (err: any) => {
        setError(
          err?.response?.data?.message ??
            "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
        );
      },
    },
    axios: { withCredentials: true },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <PageShell width="prose">
      <div className="mx-auto flex max-w-sm flex-col gap-8 py-10">
        <header className="flex flex-col gap-2">
          <p className="jd-eyebrow">Admin</p>
          <h1 className="text-heading text-ink-strong">로그인</h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-caption font-medium text-ink">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-caption font-medium text-ink"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-caption text-danger">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </div>
    </PageShell>
  );
};
