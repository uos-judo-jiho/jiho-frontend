import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { useEffect } from "react";

export interface RouterContext {
  queryClient: QueryClient;
}

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    /** 문서 제목. 가장 깊은 매치의 값이 쓰인다. */
    title?: string;
  }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

/**
 * 매치된 라우트의 staticData.title 을 문서 제목에 반영한다.
 * (기존 Helmet 컴포넌트가 하던 일. robots 메타는 index.html 로 옮겼다)
 */
const useDocumentTitle = () => {
  const matches = useMatches();
  const title = matches
    .map((match) => match.staticData.title)
    .filter(Boolean)
    .at(-1);

  useEffect(() => {
    document.title = title ? `관리자 - ${title}` : "UOS Judo Admin";
  }, [title]);
};

function RootLayout() {
  useDocumentTitle();

  return <Outlet />;
}
