import { v2Api } from "@packages/api";

/**
 * 지호지 아카이브 — 기사가 있는 연도와 각 연도의 최신 몇 편.
 *
 * 예전에는 연도 목록을 `NEWS_START_YEAR`(2022) 부터 "최신 기사 연도"까지 손으로
 * 만들고, 그 연도 수만큼(해마다 +1) `/news/{year}` 를 호출했다. 서버가
 * `GET /api/v2/news/archive` 로 한 번에 주면서(api#41) 상수도 반복 호출도
 * 사라졌다 — 기사가 하나도 없는 연도는 애초에 내려오지 않는다.
 *
 * 헤더 메뉴·푸터·/news 가 모두 이 쿼리 하나를 공유하므로 인자를 여기서만 정한다.
 */

/** 아카이브에서 연도마다 미리 보여주는 기사 수 */
export const NEWS_PREVIEW_PER_YEAR = 3;

export const newsArchiveQueryOptions = () =>
  v2Api.getGetNewsArchiveQueryOptions({ perYear: NEWS_PREVIEW_PER_YEAR });

/** 연도 묶음 (최신 연도부터). 서버가 이미 그 순서로 준다. */
export const useNewsArchive = () =>
  v2Api.useGetNewsArchiveSuspense(
    { perYear: NEWS_PREVIEW_PER_YEAR },
    { query: { select: (response) => response.data.years } },
  ).data;

/** 기사가 있는 연도만, 최신순 */
export const useNewsYears = (): number[] =>
  useNewsArchive().map(({ year }) => year);
