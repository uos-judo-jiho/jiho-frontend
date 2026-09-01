import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import { Logo } from "@/shared/ui/logo";

/**
 * 라우트 렌더 중 던져진 오류를 받는 공통 폴백.
 *
 * ## 왜 PageShell 을 쓰지 않는가
 *
 * PageShell → SiteHeader → useLatestNews 는 서스펜스 쿼리다. 최신 지호지 조회가
 * 실패해서 여기까지 온 상황이라면, 폴백 안에서 헤더를 다시 그리는 순간 같은 쿼리가
 * 또 던진다. 그리고 에러 경계는 자기 폴백이 던진 오류를 잡지 못하므로 오류가 위로
 * 새어 올라가 결국 백지가 된다. 그래서 이 화면은 쿼리에 의존하지 않는 마크업만
 * 쓴다 — 헤더도 푸터도 없다.
 */
export const ErrorPage = ({ reset }: ErrorComponentProps) => {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  // 서스펜스 쿼리는 에러 상태를 캐시에 들고 있어서, 라우터 경계만 reset 하면
  // 같은 오류가 즉시 되던져진다. 쿼리 쪽 에러도 함께 풀어 줘야 재시도가 성립한다.
  useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  const retry = () => {
    reset();
    void router.invalidate();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-gutter py-24 text-center">
      <Link to="/" aria-label="지호 홈으로">
        <Logo className="size-16" />
      </Link>

      <p className="jd-eyebrow">Error</p>
      <h1 className="text-title text-ink-strong jd-keep-all">
        내용을 불러오지 못했습니다
      </h1>
      <p className="max-w-prose text-lead text-ink-muted jd-keep-all">
        일시적인 문제일 수 있습니다. 잠시 후 다시 시도해 주세요.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          className="rounded-sm bg-ink-strong px-5 py-2.5 text-caption font-semibold text-paper transition-opacity hover:opacity-85"
        >
          다시 시도
        </button>
        <Link
          to="/"
          className="rounded-sm border border-line px-5 py-2.5 text-caption font-semibold text-ink transition-colors hover:bg-surface-subtle"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};
