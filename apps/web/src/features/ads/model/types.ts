import type { v2ApiModel } from "@packages/api/model";

/**
 * 제휴 광고(쿠팡 파트너스) 구좌의 타입 정의.
 *
 * 상품 데이터는 서버가 소유한다(`GET /v2/ads`). 여기 남는 것은 "어디에 몇 개를
 * 어떤 이름으로 보여줄지" 같은 화면 쪽 관심사뿐이다.
 */

/** 서버가 내려주는 상품. 모양의 출처는 API 스펙이다. */
export type AdProduct = v2ApiModel.AdProduct;

/**
 * 광고가 들어갈 자리. **한 화면에는 하나만** 둔다.
 *
 * 서버의 `AD_PLACEMENTS`(api 레포 `features/ads/dto/adsDto.ts`)와 같은 값이어야
 * 한다. 서버가 모르는 값을 보내면 400 이 돌아온다.
 *
 * - `article-end`: 지호지 기사·훈련일지 상세의 좋아요와 이전/다음 글 사이.
 *   두 게시판이 `features/content` 의 `ArticleDetail` 하나를 공유하므로 구좌
 *   한 개로 양쪽이 덮인다. 공지 상세(`pages/notice/notice-detail-page.tsx`)는
 *   레이아웃이 따로이고, 부 운영·행사 안내라는 공적 성격 때문에 광고를
 *   붙이지 않기로 했다.
 */
export type AdPlacement = "article-end";

export type AdSlotConfig = {
  placement: AdPlacement;
  /** 구좌 머리말. 광고임을 숨기지 않는 표현을 쓴다 */
  label: string;
  /** 한 번에 보여줄 상품 수. 서버가 더 많이 줘도 이 수까지만 그린다 */
  count: number;
};

export type AdLogEvent = "ad_impression" | "ad_click";

/**
 * 광고 노출·클릭 로그.
 *
 * **개인을 식별할 수 있는 값을 넣지 않는다.** 회원 ID·이름·이메일은 물론,
 * 이용자를 이어 붙일 수 있는 임의 식별자(쿠키·localStorage 값)도 쓰지 않는다.
 * 개인정보 처리방침 제1항이 "이용자별로 연결하거나 누적하지 않는다"고 약속한
 * 범위가 곧 이 타입이고, 서버의 `ad_events` 테이블에도 그런 컬럼이 없다 —
 * 필드를 추가할 때 그 조항을 먼저 확인할 것.
 */
export type AdLogPayload = {
  event: AdLogEvent;
  placement: AdPlacement;
  /** `AdProduct.id` */
  productId: number;
  /** 발생한 화면 경로 (쿼리스트링 제외) */
  path: string;
  /** 게시글 상세 구좌에서만 — 어느 글에서 발생했는지 */
  boardId?: number;
  /** 화면 폭 구간. 개인을 특정하는 값이 아니라 레이아웃 판단용이다 */
  viewport: "mobile" | "desktop";
};

/**
 * 로그를 남기는 쪽이 넘기는 값 — "무엇에 대한 로그인가"만 넘긴다.
 * `event` 는 훅이 정하고, `path` 와 `viewport` 는 보내는 시점에
 * `sendAdLog` 가 직접 읽으므로 호출부가 알 필요가 없다.
 */
export type AdLogTarget = Omit<AdLogPayload, "event" | "path" | "viewport">;
