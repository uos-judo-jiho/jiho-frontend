import {
  FALLBACK_LATEST_NEWS_YEAR,
  NEWS_START_YEAR,
} from "@/shared/config/site";

/**
 * 아카이브가 존재하는 연도 목록 (오름차순).
 * 이전 이름은 `vaildNewsYearList` 였다 (valid 오타).
 */
export const newsYearList = (
  latestYear: number = FALLBACK_LATEST_NEWS_YEAR,
): string[] =>
  Array.from(
    { length: Math.max(latestYear - NEWS_START_YEAR + 1, 0) },
    (_, i) => String(NEWS_START_YEAR + i),
  );

export const isValidNewsYear = (
  year: string | undefined,
  latestYear?: number,
): boolean => year !== undefined && newsYearList(latestYear).includes(year);

/** /news 아카이브에서 연도별로 미리 보여주는 기사 수. 라우트 loader 와 페이지가 같은 값을 써야 프리페치가 맞물린다. */
export const NEWS_PREVIEW_PER_YEAR = 3;
