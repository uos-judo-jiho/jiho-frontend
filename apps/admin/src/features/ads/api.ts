import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";

/**
 * 제휴 광고 상품 관리.
 *
 * 서버가 `requireRole(["root"])` 로 막고 있으므로 다른 등급이 호출하면 403 이다.
 * 라우트(`routes/_auth/ads.tsx`)에서도 같은 조건으로 막아 화면이 먼저 걸러진다.
 *
 * 입력 검증(쿠팡 링크만, 이미지는 쿠팡 CDN, 상품명에 가격 표기 금지, 공지한
 * 시행일 이전 게재 금지)은 **서버 DTO** 가 한다. 여기서 같은 규칙을 다시 구현하면
 * 두 곳이 갈라지므로, 화면은 서버가 돌려준 메시지를 그대로 보여준다.
 */
const withCredentials = { axios: { withCredentials: true } } as const;

export const useAdProducts = () =>
  v2Admin.useListAdminAds(undefined, {
    ...withCredentials,
    query: {
      // 운영자가 방금 바꾼 결과를 바로 보도록 짧게 가져간다
      staleTime: 10 * 1000,
      select: (response) => response.data.items,
    },
  });

/** 목록 쿼리를 다시 받게 한다. 등록·수정·삭제 뒤에 호출한다. */
const useInvalidateAdProducts = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: v2Admin.getListAdminAdsQueryKey(),
    });
};

export const useCreateAdProduct = () => {
  const invalidate = useInvalidateAdProducts();

  return v2Admin.useCreateAdminAd({
    ...withCredentials,
    mutation: { onSuccess: invalidate },
  });
};

export const useUpdateAdProduct = () => {
  const invalidate = useInvalidateAdProducts();

  return v2Admin.useUpdateAdminAd({
    ...withCredentials,
    mutation: { onSuccess: invalidate },
  });
};

export const useDeleteAdProduct = () => {
  const invalidate = useInvalidateAdProducts();

  return v2Admin.useDeleteAdminAd({
    ...withCredentials,
    mutation: { onSuccess: invalidate },
  });
};

/**
 * 서버가 돌려준 오류를 사람이 읽을 문구로 바꾼다.
 *
 * 광고 등록 실패는 대부분 정책 위반(파트너스 링크가 아님, 상품명에 가격 표기 등)
 * 이고, 그 사유는 서버 DTO 가 가장 정확하게 알고 있다. `fields` 에 필드별 사유가
 * 담겨 오므로 그것을 우선 보여준다.
 */
export const getAdMutationErrorMessage = (error: unknown): string => {
  const response = (
    error as {
      response?: {
        data?: { message?: string; fields?: Record<string, string> };
      };
    }
  )?.response;

  const fields = response?.data?.fields;
  if (fields) {
    const reasons = Object.values(fields).filter(Boolean);
    if (reasons.length > 0) return reasons.join("\n");
  }

  return response?.data?.message ?? "광고 상품을 저장하지 못했습니다.";
};
