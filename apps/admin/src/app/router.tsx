import { createRouter } from "@tanstack/react-router";

import { ErrorPage } from "@/pages/error-page";
import { routeTree } from "@/routeTree.gen";
import { queryClient } from "@/shared/context/QueryClient";

// vite base 를 그대로 라우터 basepath 로 쓴다 (기존 BrowserRouter basename 과 동일).
const basepath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

export const router = createRouter({
  routeTree,
  basepath,
  // beforeLoad 에서 me 를 조회할 수 있도록 queryClient 를 컨텍스트로 넘긴다.
  context: { queryClient },
  defaultPreload: "intent",
  // _auth 는 <Suspense> 만 두고 에러 경계가 없었다 — 서스펜스 쿼리 하나가
  // 실패하면 앱 전체가 백지가 된다. 매치마다 경계를 세워 실패한 라우트만
  // 폴백으로 바꾼다.
  defaultErrorComponent: ErrorPage,
  // 폴백 컴포넌트가 아니라 여기서 로그를 남긴다 — 잡힐 때 한 번만 호출되므로
  // 리렌더마다 중복으로 찍히지 않는다.
  defaultOnCatch: (error) => {
    console.error("[route error]", error);
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
