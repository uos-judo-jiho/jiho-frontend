import { v2Api } from "@packages/api";
import type { v2ApiModel } from "@packages/api/model";
import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * 세 게시판(지호지·훈련일지·공지) 목록은 서버에서 하나로 합쳐졌다 —
 * `GET /api/v2/boards?type=` 하나가 예전의 `/trainings`·`/notices`·`/news/{year}`
 * 를 대신한다 (api#41). 응답 아이템도 목록 전용 축약 스키마(BoardSummary)라
 * 마크다운 본문과 사진 전부 대신 평문 `excerpt` 와 썸네일 1장만 실린다.
 *
 * 새 목록은 페이지네이션을 전제로 하므로 `limit` 에 기본값이 있다(최대 100).
 * 예전처럼 "전부 받아서 화면에서 자르기"가 불가능하니, 목록 화면은 여기 있는
 * 무한 쿼리로 페이지를 이어 붙인다.
 */

export type BoardListParams = {
  type: v2ApiModel.ListBoardsType;
  /** 지호지처럼 연도로 나눠 보는 목록에서만 쓴다 */
  year?: number;
  limit?: number;
};

/** 목록 한 페이지 크기. 그리드가 4열이라 배수로 잡는다. */
export const BOARD_PAGE_SIZE = 24;

/**
 * "더 보기"로 이어 붙이는 목록. 다음 오프셋은 서버가 준 total 로만 판단하므로
 * 마지막 페이지가 꽉 차 있어도 빈 요청을 한 번 더 보내지 않는다.
 */
export const boardListInfiniteQueryOptions = ({
  limit = BOARD_PAGE_SIZE,
  ...params
}: BoardListParams) =>
  infiniteQueryOptions({
    queryKey: v2Api.getListBoardsInfiniteQueryKey({ ...params, limit }),
    queryFn: ({ pageParam, signal }) =>
      v2Api.listBoards({ ...params, limit, offset: pageParam }, { signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.data.offset + lastPage.data.items.length;
      return loaded < lastPage.data.total ? loaded : undefined;
    },
  });

export const useBoardList = (params: BoardListParams) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(boardListInfiniteQueryOptions(params));

  const items = useMemo(
    () => data.pages.flatMap((page) => page.data.items),
    [data.pages],
  );

  return {
    items,
    /** 필터에 해당하는 전체 개수 — 지금 화면에 그린 수가 아니다 */
    total: data.pages[0]?.data.total ?? 0,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    loadMore: fetchNextPage,
  };
};

/**
 * 최신 몇 건만 보여주는 자리(홈 미리보기)용 단발 쿼리.
 * 라우트 loader 와 컴포넌트가 같은 인자를 써야 프리페치가 그대로 하이드레이션된다.
 */
export const latestBoardsQueryOptions = (params: BoardListParams) =>
  v2Api.getListBoardsQueryOptions(params);

export const useLatestBoards = (params: BoardListParams) =>
  v2Api.useListBoardsSuspense(params, {
    query: { select: (response) => response.data.items },
  }).data;
