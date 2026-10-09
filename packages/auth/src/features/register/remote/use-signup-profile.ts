import { v2Admin } from "@packages/api";

type SignupProfileParams = Parameters<typeof v2Admin.useUpdateSignupProfile>;

/**
 * 가입 직후 추가 정보 저장 mutation.
 * 승인 전 임시 토큰(pendingToken)을 Bearer 로 실어 인증한다.
 */
export const useSignupProfileMutation = (
  pendingToken: string,
  options?: SignupProfileParams[0],
  queryClient?: SignupProfileParams[1],
): ReturnType<typeof v2Admin.useUpdateSignupProfile> =>
  v2Admin.useUpdateSignupProfile(
    {
      ...options,
      axios: { headers: { Authorization: `Bearer ${pendingToken}` } },
    },
    queryClient,
  );
