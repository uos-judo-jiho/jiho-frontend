import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import axios from "axios";

import { ErrorPage } from "@/pages/error-page";

import { routeTree } from "./routeTree.gen";

const API_HOSTS = ["http://localhost:4000", "https://api.uosjudo.com"];

const AXIOS_INTERCEPTOR_KEY = "__JIHO_AXIOS_INTERCEPTOR__";

const globalAny = globalThis as typeof globalThis & {
  [AXIOS_INTERCEPTOR_KEY]?: boolean;
};

if (!globalAny[AXIOS_INTERCEPTOR_KEY]) {
  if (typeof window === "undefined") {
    // SSR: AxiosResponse.request 는 직렬화 불가능하므로 dehydrate 전에 제거
    axios.interceptors.response.use(
      (response) => {
        if (response && "request" in response) {
          delete (response as { request?: unknown }).request;
        }
        return response;
      },
      (error) => {
        if (error?.response && "request" in error.response) {
          delete (error.response as { request?: unknown }).request;
        }
        return Promise.reject(error);
      },
    );
  } else {
    // 클라이언트: 절대 경로로 생성된 API 요청을 상대 경로로 바꿔 프록시를 태운다 (CORS 방지)
    axios.interceptors.request.use((config) => {
      if (typeof config.url === "string") {
        for (const host of API_HOSTS) {
          if (config.url.startsWith(host)) {
            config.url = config.url.replace(host, "");
            break;
          }
        }
      }
      return config;
    });
  }
  globalAny[AXIOS_INTERCEPTOR_KEY] = true;
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        refetchOnWindowFocus: false,
        refetchOnMount: false, // SSR 캐시 활용
        refetchOnReconnect: false,
        retry: typeof window === "undefined" ? false : 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    // 모든 페이지가 use*Suspense 로 데이터를 읽고, 헤더의 최신 지호지 쿼리는
    // PageShell 을 통해 전 페이지에 걸려 있다. 경계가 없으면 API 가 한 번
    // 실패하는 것만으로 SSR 이 500 을 내고 클라이언트는 백지가 된다.
    // 라우터는 매치마다 이 컴포넌트로 경계를 세우므로, 실패한 라우트만 폴백으로
    // 대체되고 나머지는 그대로 남는다.
    defaultErrorComponent: ErrorPage,
    // 폴백 컴포넌트가 아니라 여기서 로그를 남긴다 — 잡힐 때 한 번만 호출되므로
    // 리렌더마다 중복으로 찍히지 않고, SSR 렌더 중에 터진 오류도 서버 로그에 남는다.
    defaultOnCatch: (error) => {
      console.error("[route error]", error);
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    dehydrateOptions: {
      // 쿼리 캐시에는 AxiosResponse(함수를 가진 config 등)가 담기므로
      // seroval 직렬화 전에 JSON-safe 값으로 정리한다 (기존 JSON.stringify 주입과 동일한 동작).
      serializeData: (data) => JSON.parse(JSON.stringify(data)),
    },
  });

  return router;
}
