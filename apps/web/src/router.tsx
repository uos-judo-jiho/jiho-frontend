import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import axios from "axios";

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
