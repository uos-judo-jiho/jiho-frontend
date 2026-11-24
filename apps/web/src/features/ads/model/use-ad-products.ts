import { v2Api } from "@packages/api";

import { AD_SLOTS } from "./slots";
import type { AdPlacement, AdProduct } from "./types";

/**
 * 게재 중인 광고 상품 — 구좌 전체를 한 번에 받아 화면에서 나눈다.
 *
 * 구좌마다 따로 요청하지 않는 이유: 응답이 아주 작고 이용자별로 다르지 않아서,
 * 한 번 받아 두면 어느 페이지에서든 재사용된다. `__root.tsx` 가 이 쿼리를
 * 프리페치하므로 방문당 요청은 한 번이고, 구좌가 늘어도 요청은 늘지 않는다.
 *
 * 그래서 **반드시 인자 없이** 호출한다 — 루트 로더의 프리페치와 쿼리 키가
 * 어긋나면 SSR 에서 받아 둔 데이터를 못 쓰고 워터폴이 생긴다 (CLAUDE.md).
 */
export const adsQueryOptions = () => v2Api.getListAdsQueryOptions();

/**
 * 이 구좌에 그릴 상품.
 *
 * 서스펜스 훅을 쓰지 않는다 — 광고 응답이 늦거나 실패해도 본문 렌더를 막아선
 * 안 된다. 실패하면 빈 배열이 되어 구좌가 조용히 사라진다.
 */
export const useAdProducts = (placement: AdPlacement): AdProduct[] => {
  const { data } = v2Api.useListAds(undefined, {
    query: {
      select: (response) =>
        response.data.items
          .filter((item) => item.placement === placement)
          .slice(0, AD_SLOTS[placement].count),
    },
  });

  return data ?? [];
};
