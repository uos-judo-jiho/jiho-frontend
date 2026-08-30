import { createRouter } from "@tanstack/react-router";

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
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
