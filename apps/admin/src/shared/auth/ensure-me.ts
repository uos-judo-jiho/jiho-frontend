import { v2Admin } from "@packages/api";
import { v2AdminModel } from "@packages/api/model";
import type { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export type Me = v2AdminModel.GetApiV2AdminMeResponse;

const meQueryOptions = () =>
  v2Admin.getGetApiV2AdminMeQueryOptions({
    axios: { withCredentials: true },
    query: { retry: false },
  });

const isUnauthorized = (error: unknown) => isAxiosError(error) && error.response?.status === 401;

/**
 * orval 설정이 `shouldExportHttpClient: false` 라 refresh 요청 함수가 직접
 * 노출되지 않는다. mutation options 안에 들어 있는 mutationFn 을 꺼내 쓴다.
 */
const refreshToken = async (queryClient: QueryClient) => {
  const { mutationFn, mutationKey } = v2Admin.getPostApiV2AdminRefreshMutationOptions({
    axios: { withCredentials: true },
  });

  if (!mutationFn) {
    throw new Error("refresh mutationFn 을 찾을 수 없습니다.");
  }

  // 훅 밖에서 직접 호출하므로 mutation 컨텍스트를 직접 만들어 넘긴다.
  await mutationFn(undefined, { client: queryClient, meta: undefined, mutationKey });
};

/**
 * 라우트 beforeLoad 에서 쓰는 인증 확인.
 *
 * me 조회가 401 이면 refresh 를 한 번만 시도하고 다시 조회한다.
 * 끝내 실패하면 null 을 돌려주고, 어디로 보낼지는 호출한 라우트가 정한다.
 * 결과는 queryClient 에 그대로 남아 화면의 useGetApiV2AdminMe* 훅이
 * 같은 캐시를 재사용한다.
 */
export const ensureMe = async (queryClient: QueryClient): Promise<Me | null> => {
  try {
    const response = await queryClient.ensureQueryData(meQueryOptions());
    return response.data;
  } catch (error) {
    if (!isUnauthorized(error)) {
      return null;
    }
  }

  try {
    await refreshToken(queryClient);
  } catch {
    return null;
  }

  // refresh 로 쿠키가 갱신됐으니 실패로 캐시된 me 를 버리고 다시 받는다.
  queryClient.removeQueries({ queryKey: v2Admin.getGetApiV2AdminMeQueryKey() });

  try {
    const response = await queryClient.ensureQueryData(meQueryOptions());
    return response.data;
  } catch {
    return null;
  }
};
