import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { extractMessage } from "@/shared/lib/extract-message";

/**
 * 라우트 렌더 중 던져진 오류를 받는 공통 폴백.
 *
 * `_auth` 는 페이지들이 useSuspenseQuery 를 쓰기 때문에 <Suspense> 로 감싸져
 * 있었지만 에러 경계는 없었다 — 쿼리 하나가 실패하면 앱 전체가 백지가 됐다.
 * 라우터가 매치마다 이 컴포넌트로 경계를 세우므로, 실패한 라우트만 이 화면으로
 * 바뀌고 사이드바가 있는 바깥 레이아웃은 그대로 남는다.
 *
 * 레이아웃 안(Outlet 자리)과 밖(루트) 양쪽에서 렌더될 수 있어 화면 전체를
 * 차지하지 않고 자기 영역만 채운다.
 */
export const ErrorPage = ({ error, reset }: ErrorComponentProps) => {
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
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-xl font-bold text-foreground">
        내용을 불러오지 못했습니다
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        일시적인 문제일 수 있습니다. 잠시 후 다시 시도해 주세요.
      </p>
      {/* 관리자만 보는 화면이라 원인을 그대로 보여준다 — 제보할 때 필요하다.
          axios 응답이면 백엔드 message 를, 아니면 던져진 오류 자체를 쓴다. */}
      <p className="max-w-prose break-all text-xs text-muted-foreground/80">
        {extractMessage(error, error.message)}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={retry}>
          다시 시도
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link to="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
};
