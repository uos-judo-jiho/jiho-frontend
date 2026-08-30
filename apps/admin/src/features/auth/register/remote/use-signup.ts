import { v2Admin } from "@packages/api";

/**
 * 회원가입 mutation — 세션 쿠키 수신을 위해 withCredentials 를 기본 적용한다.
 * 훅 시그니처를 그대로 미러링해 제네릭이 호출부에서 유지되도록 한다.
 */
export const useSignupMutation: typeof v2Admin.usePostApiV2AdminSignup = (
  options,
  queryClient,
) =>
  v2Admin.usePostApiV2AdminSignup(
    { ...options, axios: { withCredentials: true, ...options?.axios } },
    queryClient,
  );
