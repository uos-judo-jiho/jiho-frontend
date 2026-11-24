import type { AdPlacement, AdSlotConfig } from "./types";

/**
 * 구좌 정의. **여기에 없는 자리에는 광고를 두지 않는다.**
 *
 * 전면 팝업·인터스티셜, 화면에 붙어 다니는 고정 배너, 로그인·약관·개인정보
 * 처리방침 화면, 앨범 라이트박스 안은 넣지 않기로 한 자리다. 구좌를 늘릴
 * 때는 왜 그 자리인지 함께 적고, 서버의 `AD_PLACEMENTS` 에도 값을 더한다.
 *
 * ## 게재 시작 시각은 여기 없다
 *
 * 공지한 개정 시행일(2026-12-01) 전에는 아무것도 나오지 않아야 하는데, 그 하한은
 * **서버가** 들고 있다(api 레포 `AD_EARLIEST_START_AT` + `isLaunched`). 프론트에
 * 같은 날짜를 또 두면 두 곳이 갈라질 수 있고, 어차피 상품을 서버에서 받아오므로
 * 프론트의 날짜 분기는 보호 장치가 되지 못한다.
 */
export const AD_SLOTS: Record<AdPlacement, AdSlotConfig> = {
  /**
   * 지호지 기사·훈련일지 상세에서, 본문을 다 읽고 좋아요를 누른 다음
   * 이전/다음 글을 고르는 자리. 읽는 흐름을 끊지 않으면서 "다음 행동"의
   * 선택지로 섞인다. 좋아요보다 **뒤**에 두는 이유는 그 앞에 끼우면 참여
   * 동작의 전환을 가로채기 때문이다.
   */
  "article-end": {
    placement: "article-end",
    label: "함께 보면 좋은 용품",
    count: 2,
  },
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

export const buildAdHref = (linkUrl: string, placement: AdPlacement) => {
  if (!AD_SUB_ID_ENABLED) return linkUrl;

  const url = new URL(linkUrl);
  url.searchParams.set("subId", placement);

  return url.toString();
};
