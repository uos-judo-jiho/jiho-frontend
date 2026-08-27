import { v2Admin } from "@packages/api";

/**
 * 로그인 mutation — 세션 쿠키 수신을 위해 withCredentials 를 기본 적용한다.
 * 훅 시그니처를 그대로 미러링해 에러 타입 등 제네릭이 호출부에서 유지되도록 한다.
 */
export const useLoginMutation: typeof v2Admin.usePostApiV2AdminLogin = (
  options,
  queryClient,
) =>
  v2Admin.usePostApiV2AdminLogin(
    { ...options, axios: { withCredentials: true, ...options?.axios } },
    queryClient,
  );
