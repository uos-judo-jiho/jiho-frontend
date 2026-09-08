import { yearOf } from "@/shared/lib/format";

import { latestBoardsQueryOptions, useLatestBoards } from "@/features/content";

/** 홈 "최신 지호지" 블록이 보여주는 기사 수 (크게 1편 + 그리드 4편) */
export const LATEST_NEWS_LIMIT = 5;

export const latestNewsQueryOptions = () =>
  latestBoardsQueryOptions({ type: "news", limit: LATEST_NEWS_LIMIT });

/**
 * 최신 지호지 기사와, 그로부터 계산한 "가장 최근 발행 연도".
 * 통합 목록 엔드포인트로 옮겨오면서 `/news/latest` 는 쓰지 않는다 (api#41).
 */
export const useLatestNews = () => {
  const news = useLatestBoards({ type: "news", limit: LATEST_NEWS_LIMIT });

  return { news, latestNewsYear: yearOf(news[0]?.dateTime) };
};
