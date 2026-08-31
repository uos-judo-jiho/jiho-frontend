import { v2Admin } from "@packages/api";

/** me 응답을 재조회 없이 재사용하는 시간 */
const ME_STALE_TIME = 5 * 60 * 1000;

export const meQueryKey = v2Admin.getGetApiV2AdminMeQueryKey();

/**
 * 현재 로그인 상태.
 *
 * ## 왜 loader 에서 prefetch 하지 않는가
 *
 * `useBoardReaction` 과 같은 이유다 — SSR 의 axios 는 백엔드를 절대 URL 로 직접
 * 부르고 브라우저 쿠키를 싣지 않으므로(`router.tsx` 인터셉터 참고), 서버에서 받은
 * me 는 로그인한 사용자에게도 늘 401 이다. 그 값을 dehydrate 하면 전역 staleTime
 * 24시간·`refetchOnMount: false` 때문에 "로그아웃 상태"가 그대로 굳어버린다.
 *
 * 그래서 이 쿼리는 클라이언트 전용으로 두고 캐시 정책도 따로 준다. SSR 과
 * 하이드레이션 직후의 첫 렌더는 둘 다 데이터가 없는 상태라 마크업이 일치하고,
 * 응답이 도착한 뒤에 로그인/로그아웃 UI 로 바뀐다.
 */
export const useMe = () => {
  const { data, isPending } = v2Admin.useGetApiV2AdminMe({
    query: {
      // 사용자마다 다른 값이라 전역 캐시 정책(24시간)에서 빼낸다
      staleTime: ME_STALE_TIME,
      refetchOnMount: true,
      // 비로그인은 401 이 정상 응답이다 — 재시도할 이유가 없고,
      // retryOnMount 까지 꺼야 페이지를 옮길 때마다 401 을 다시 받지 않는다
      retry: false,
      retryOnMount: false,
      select: (response) => response.data,
    },
    axios: { withCredentials: true },
  });

  return {
    user: data?.authenticated ? data.user : undefined,
    isAuthenticated: data?.authenticated ?? false,
    /** 첫 조회가 끝나기 전 (SSR·하이드레이션 직후에는 항상 true) */
    isPending,
  };
};
