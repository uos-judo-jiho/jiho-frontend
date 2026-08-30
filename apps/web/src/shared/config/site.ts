/**
 * 사이트 단위 상수.
 *
 * 색·폰트 크기는 여기 두지 않는다 — 그건 전부 app/styles/tokens.css 소관이다.
 * (기존 `shared/lib/constant` 는 색 hex 를 JS 로도 들고 있어서 CSS 토큰과
 *  이중 관리되고 있었다)
 */

export const SITE = {
  name: "서울시립대학교 유도부 지호",
  nameKo: "서울시립대학교 유도 동아리 지호 志豪",
  nameEn: "University of Seoul Judo Team 志豪",
  since: "Since 1985",
  foundingYear: "1985",
  url: "https://uosjudo.com",
  instagram: {
    handle: "@uos_judo",
    url: "https://www.instagram.com/uos_judo/",
  },
  email: "uosjudojiho@gmail.com",
  practice: {
    label: "정규 운동",
    time: "매주 월, 수, 금 18:00–20:00",
    place: "서울시립대 건설공학관 지하 1층",
    address: "서울특별시 동대문구 서울시립대로 163 (전농동)",
  },
} as const;

/** 지호지 아카이브가 시작되는 연도 */
export const NEWS_START_YEAR = 2022;

/**
 * 아직 게시물이 하나도 없을 때 기준으로 삼는 최신 연도.
 * 실제 값은 API 의 최신 기사 날짜에서 가져온다(useLatestNews).
 */
export const FALLBACK_LATEST_NEWS_YEAR = 2026;
