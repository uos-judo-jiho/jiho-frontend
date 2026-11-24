/**
 * 제휴 광고(쿠팡 파트너스) 구좌의 타입 정의.
 *
 * 구좌를 늘리려면 `AdPlacement` 에 값을 추가하고 `AD_SLOTS` 에 설정을 더해야
 * 한다. 두 곳을 모두 고쳐야 하므로 "어느새 광고가 늘어나 있는" 일이 없다.
 */

/**
 * 광고가 들어갈 자리. **한 화면에는 하나만** 둔다.
 *
 * - `article-end`: 지호지 기사·훈련일지 상세의 좋아요와 이전/다음 글 사이.
 *   두 게시판이 `features/content` 의 `ArticleDetail` 하나를 공유하므로 구좌
 *   한 개로 양쪽이 덮인다. 공지 상세(`pages/notice/notice-detail-page.tsx`)는
 *   레이아웃이 따로이고, 부 운영·행사 안내라는 공적 성격 때문에 광고를
 *   붙이지 않기로 했다.
 */
export type AdPlacement = "article-end";

/** 구좌별로 어떤 상품군을 보여줄지 가르는 분류. */
export type AdCategory =
  /** 도복·띠·도복 가방 등 입문 장비 */
  | "uniform"
  /** 테이프·보호대·마우스가드 등 훈련 중 쓰는 것 */
  | "training-gear"
  /** 폼롤러·마사지건·아이싱 등 훈련 후 회복용 */
  | "recovery"
  /** 보충제·쉐이커·전해질 */
  | "nutrition";

export type AdProduct = {
  /**
   * 로그 집계 키. 상품명이나 링크가 바뀌어도 통계가 끊기지 않도록 직접 붙인다.
   * 쿠팡의 상품 번호를 쓰지 않는 이유는, 같은 상품을 다른 구좌에서 다른 맥락으로
   * 쓸 때 구분이 필요하기 때문이다.
   */
  id: string;
  name: string;
  /**
   * 쿠팡이 제공한 이미지 URL 을 **그대로** 둔다. 내려받아 우리 저장소에
   * 올리는 것은 파트너스 정책 위반이다. 링크만 있고 이미지가 없는 상품도
   * 있으므로 선택 항목이다.
   */
  imageUrl?: string;
  /** 블로그용 상품 링크 (`https://link.coupang.com/a/...`) */
  linkUrl: string;
  category: AdCategory;
};

export type AdSlotConfig = {
  placement: AdPlacement;
  /** 구좌 머리말. 광고임을 숨기지 않는 표현을 쓴다 */
  label: string;
  /** 이 구좌에 어울리는 상품군 (앞에 적은 것이 우선) */
  categories: AdCategory[];
  /** 한 번에 보여줄 상품 수 */
  count: number;
};

export type AdLogEvent = "ad_impression" | "ad_click";

/**
 * 광고 노출·클릭 로그.
 *
 * **개인을 식별할 수 있는 값을 넣지 않는다.** 회원 ID·이름·이메일은 물론,
 * 이용자를 이어 붙일 수 있는 임의 식별자(쿠키·localStorage 값)도 쓰지 않는다.
 * 개인정보 처리방침 제1항이 "이용자별로 연결하거나 누적하지 않는다"고 약속한
 * 범위가 곧 이 타입이다 — 필드를 추가할 때 그 약속을 먼저 확인할 것.
 */
export type AdLogPayload = {
  event: AdLogEvent;
  placement: AdPlacement;
  /** `AdProduct.id` */
  productId: string;
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
