import { v2Api } from "@packages/api";

import { yearOf } from "@/shared/lib/format";

/**
 * 최신 지호지 기사 목록과, 그로부터 계산한 "가장 최근 발행 연도".
 * 헤더 메뉴·푸터·홈이 모두 이 연도를 기준으로 링크를 만든다.
 */
export const useLatestNews = (limit = 5) => {
  const { data: news } = v2Api.useGetApiV2NewsLatestSuspense(
    { limit },
    { query: { select: (response) => response.data.articles } },
  );

  return { news, latestNewsYear: yearOf(news[0]?.dateTime) };
};
