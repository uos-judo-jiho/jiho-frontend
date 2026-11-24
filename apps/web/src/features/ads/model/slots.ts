import { AD_PRODUCTS, PREVIEW_PRODUCTS } from "./products";
import type { AdPlacement, AdProduct, AdSlotConfig } from "./types";

/**
 * 광고 게재 시작 시각 (KST).
 *
 * 개인정보 처리방침·이용약관의 개정 시행일과 **같은 날짜여야 한다**. 방침이
 * "시행일 최소 7일 전 공지"를 약속하고 있으므로, 공지 없이 이 값을 앞당기면
 * 방침 위반이다. 이 게이트 덕분에 코드를 미리 머지해도 광고는 나오지 않는다.
 */
export const AD_LAUNCH_AT = "2026-12-01T00:00:00+09:00";

/** 게재 시작 시각이 지났는지. */
export const isAdLaunched = (now: number = Date.now()) =>
  now >= new Date(AD_LAUNCH_AT).getTime();

/**
 * 구좌 정의. **여기에 없는 자리에는 광고를 두지 않는다.**
 *
 * 전면 팝업·인터스티셜, 화면에 붙어 다니는 고정 배너, 로그인·약관·개인정보
 * 처리방침 화면, 앨범 라이트박스 안은 넣지 않기로 한 자리다. 구좌를 늘릴
 * 때는 왜 그 자리인지 함께 적는다.
 */
export const AD_SLOTS: Record<AdPlacement, AdSlotConfig> = {
  /**
   * 지호지 기사·훈련일지 상세에서, 본문을 다 읽고 좋아요를 누른 다음
   * 이전/다음 글을 고르는 자리.
   * 읽는 흐름을 끊지 않으면서 "다음 행동"의 선택지로 섞인다. 좋아요보다
   * **뒤**에 두는 이유는 그 앞에 끼우면 참여 동작의 전환을 가로채기 때문이다.
   */
  "article-end": {
    placement: "article-end",
    label: "함께 보면 좋은 용품",
    categories: ["training-gear", "recovery", "uniform", "nutrition"],
    count: 2,
  },
};

/** 파트너스가 발급한 링크인지. 오타나 직접 만든 URL 을 걸러낸다. */
const isAffiliateLink = (url: string) =>
  url.startsWith("https://link.coupang.com/");

/**
 * 구좌에 실제로 그릴 상품.
 *
 * 카탈로그가 비어 있거나(링크 미등록) 게재 시작 전이면 빈 배열이고, 구좌는
 * 아무것도 그리지 않는다.
 *
 * 개발 서버에서는 두 가지를 느슨하게 둔다 — 게재 시작 날짜를 보지 않고,
 * 카탈로그가 비었으면 미리보기 상품을 쓴다. 날짜 게이트는 "공지 없이 광고를
 * 내보내지 않는다"는 약속을 지키기 위한 것이므로 방문자가 없는 로컬에서는
 * 의미가 없고, 그 사이에 구좌 레이아웃을 손볼 수 없으면 곤란하다.
 * 프로덕션 빌드에서는 두 우회가 모두 사라진다.
 */
export const resolveAdProducts = (
  placement: AdPlacement,
  now: number = Date.now(),
): AdProduct[] => {
  if (!import.meta.env.DEV && !isAdLaunched(now)) return [];

  const slot = AD_SLOTS[placement];
  const catalog =
    AD_PRODUCTS.length === 0 && import.meta.env.DEV
      ? PREVIEW_PRODUCTS
      : AD_PRODUCTS;

  return slot.categories
    .flatMap((category) =>
      catalog.filter(
        (product) =>
          product.category === category && isAffiliateLink(product.linkUrl),
      ),
    )
    .slice(0, slot.count);
};

/**
 * 파트너스 리포트에 구좌를 되돌려 주기 위한 `subId`.
 *
 * 파트너스 정산 리포트는 전환(주문)만 주고 우리 구좌를 모르므로, 링크에
 * `subId` 를 실어 보내면 "어느 구좌가 돈이 되는지"를 역추적할 수 있다.
 * 처음부터 붙여 두지 않으면 나중에 소급할 방법이 없다.
 *
 * 파라미터 이름·허용 길이는 파트너스 운영정책에 따라 달라질 수 있으므로,
 * 리포트에 값이 들어오지 않으면 이 상수를 `false` 로 내려 링크를 원본
 * 그대로 쓰면 된다.
 */
const AD_SUB_ID_ENABLED = true;

export const buildAdHref = (product: AdProduct, placement: AdPlacement) => {
  if (!AD_SUB_ID_ENABLED) return product.linkUrl;

  const url = new URL(product.linkUrl);
  url.searchParams.set("subId", placement);

  return url.toString();
};
