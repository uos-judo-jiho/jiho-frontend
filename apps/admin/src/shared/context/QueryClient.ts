import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      gcTime: 24 * 60 * 60 * 1000, // 24 hours (formerly cacheTime)
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
      refetchOnMount: false, // 마운트 시 자동 refetch 비활성화 (SSR 캐시 활용)
      refetchOnReconnect: false, // 재연결 시 자동 refetch 비활성화
      retry: 1, // 실패 시 1번만 재시도
      throwOnError: true, // 에러 발생 시 throw
    },
  },
});
