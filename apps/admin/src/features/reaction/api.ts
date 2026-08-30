import { v2Api } from "@packages/api";

/**
 * 게시글 반응(좋아요) 조회.
 *
 * 반응 API 는 admin 스코프에 없고 api 스코프에만 있어서(API PR #35) v2Admin 이
 * 아니라 v2Api 클라이언트를 쓴다. 집계 조회는 비로그인도 허용되지만, 운영 화면은
 * 어차피 로그인 상태이므로 다른 admin 호출과 같이 쿠키를 실어 보낸다.
 */
const withCredentials = { axios: { withCredentials: true } } as const;

/** 게시글 1건의 반응 요약. */
export const useBoardReactions = (boardId: number | undefined) =>
  v2Api.useGetApiV2BoardsBoardIdReactions(Number(boardId), {
    ...withCredentials,
    query: {
      enabled: Number.isFinite(Number(boardId)),
      // 운영자가 새로고침 없이 최신 수치를 보도록 캐시를 짧게 가져간다
      staleTime: 30 * 1000,
      select: (response) => response.data,
    },
  });

/** 게시글 최대 100건의 반응 요약을 한 번에. 목록 화면의 N+1 을 피한다. */
export const MAX_BULK_BOARD_IDS = 100;

export const useBulkBoardReactions = (boardIds: number[]) => {
  const ids = boardIds.filter(Number.isFinite).slice(0, MAX_BULK_BOARD_IDS);

  return v2Api.useGetApiV2BoardsReactions(
    { boardIds: ids.join(",") },
    {
      ...withCredentials,
      query: {
        enabled: ids.length > 0,
        staleTime: 30 * 1000,
        select: (response) =>
          new Map(
            response.data.summaries.map((summary) => [
              summary.boardId,
              summary,
            ]),
          ),
      },
    },
  );
};
