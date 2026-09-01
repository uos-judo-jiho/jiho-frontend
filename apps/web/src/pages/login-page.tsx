import { v2Admin } from "@packages/api";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { logger } from "@99mini/logger-client";

import { resolveRedirectPath, useMe } from "@/features/auth";
import { SITE } from "@/shared/config/site";
import { Button } from "@/shared/ui/primitives/button";
import { Input } from "@/shared/ui/primitives/input";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/login");

export const LoginPage = () => {
  const { redirectTo } = routeApi.useSearch();
  const navigate = useNavigate();
  const { isAuthenticated } = useMe();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    logger.info("로그인", { path: window.location.pathname });
  }, []);

  /**
   * 이미 로그인한 사용자가 이 화면에 남아 있을 이유가 없다.
   * 로그인 여부는 클라이언트에서만 알 수 있어서(SSR 은 브라우저 쿠키를 못 본다)
   * 라우트의 beforeLoad 가 아니라 여기서 확인하고 돌려보낸다.
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    navigate({ href: resolveRedirectPath(redirectTo), replace: true });
  }, [isAuthenticated, redirectTo, navigate]);

  const loginMutation = v2Admin.useAdminLogin({
    mutation: {
      onSuccess: () => {
        // 세션 쿠키를 반영하기 위해 전체 새로고침으로 이동한다
        window.location.href = resolveRedirectPath(redirectTo);
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

  if (isAuthenticated) {
    return (
      <PageShell width="prose">
        <div className="mx-auto flex max-w-sm flex-col gap-2 py-20 text-center">
          <p className="text-subheading text-ink-strong">
            이미 로그인되어 있어요
          </p>
          <p className="text-caption text-ink-muted">
            보던 화면으로 돌아갑니다…
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell width="prose">
      <div className="mx-auto flex max-w-sm flex-col gap-8 py-10">
        <header className="flex flex-col gap-2">
          <p className="jd-eyebrow">Admin</p>
          <h1 className="text-heading text-ink-strong">로그인</h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-caption font-medium text-ink"
            >
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

        {/*
          가입 화면은 웹에 없고 관리자 사이트가 갖고 있다. 다른 도메인이라
          <Link> 가 아니라 <a> 로 나가야 하고, 이 탭에는 redirectTo 가 담긴
          로그인 화면을 남겨 둬야 가입 후 돌아와 바로 이어갈 수 있으므로
          새 탭으로 연다.
        */}
        <div className="flex flex-col gap-1 border-t border-line pt-6">
          <p className="text-caption text-ink-muted">아직 계정이 없으신가요?</p>
          <a
            href={SITE.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 text-caption font-medium text-accent-strong underline underline-offset-4 transition-colors hover:text-ink-strong"
          >
            회원가입 하러 가기
            <span aria-hidden>↗</span>
            <span className="sr-only">(관리자 사이트에서 새 탭으로 열림)</span>
          </a>
          <p className="text-micro text-ink-faint">
            가입은 관리자 사이트에서 진행되며, 승인 후 로그인할 수 있어요.
          </p>
        </div>
      </div>
    </PageShell>
  );
};
