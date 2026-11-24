import type { AdProduct } from "./types";

/**
 * 쿠팡 파트너스 "블로그용 링크"로 받은 상품 목록.
 *
 * 비어 있으면 광고 구좌는 **아무것도 그리지 않는다**. 즉 링크를 채우기 전까지
 * 이 기능은 배포돼 있어도 화면에 나타나지 않는다. 링크·이미지·상품명은 모두
 * 파트너스에서 발급받은 값을 그대로 옮긴다.
 *
 * 등록 예시:
 *
 * ```ts
 * export const AD_PRODUCTS: AdProduct[] = [
 *   {
 *     id: "finger-tape-01",
 *     name: "유도 손가락 테이프 (1.25cm)",
 *     imageUrl: "https://thumbnail6.coupangcdn.com/thumbnails/remote/...jpg",
 *     linkUrl: "https://link.coupang.com/a/XXXXXX",
 *     category: "training-gear",
 *   },
 * ];
 * ```
 *
 * 등록할 때 지킬 것 (`docs/affiliate-ads.md` 참고):
 * - 가격·할인율을 `name` 에 쓰지 않는다 — 실시간으로 바뀌므로 표기 자체가 위험하다.
 * - 이미지는 쿠팡이 준 URL 그대로. 내려받아 S3 에 올리면 정책 위반이다.
 * - 체중 감량 보조제·주류·도박, 효능 표현이 필요한 의약외품은 올리지 않는다.
 */
export const AD_PRODUCTS: AdProduct[] = [];

/**
 * 개발 서버에서만 쓰는 미리보기 상품.
 *
 * 파트너스 승인 전에도 구좌의 레이아웃·간격·표기 문구를 확인할 수 있어야 하므로
 * 둔다. `linkUrl` 은 실재하지 않는 주소라 눌러도 쿠팡에서 404 가 나며, 개발
 * 모드에서는 로그가 네트워크로 나가지 않고 콘솔로만 떨어진다(`sendAdLog`).
 */
export const PREVIEW_PRODUCTS: AdProduct[] = [
  {
    id: "preview-finger-tape",
    name: "손가락 테이프 (미리보기)",
    linkUrl: "https://link.coupang.com/a/PREVIEW1",
    category: "training-gear",
  },
  {
    id: "preview-foam-roller",
    name: "폼롤러 (미리보기)",
    linkUrl: "https://link.coupang.com/a/PREVIEW2",
    category: "recovery",
  },
];
