import { v2Api } from "@packages/api";
import type { v2ApiModel } from "@packages/api/model";

/**
 * 게시글 단건은 종류를 가리지 않는 `GET /api/v2/boards/{boardId}` 하나로 모였다
 * (api#41). 앞뒤 글(prev/next)도 같은 응답에 들어 있다.
 *
 * `neighborScope` 는 앞뒤 글을 어느 범위에서 찾을지 정한다 — 기본은 같은 게시판
 * 전체이고, 연도별로 목록을 나눠 보는 지호지만 `year` 를 쓴다. loader 와 화면이
 * 같은 값을 써야 쿼리 키가 맞물리므로 이 헬퍼를 거친다.
 */
export const boardDetailQueryOptions = (
  boardId: number,
  neighborScope: v2ApiModel.GetBoardNeighborScope = "type",
) => v2Api.getGetBoardQueryOptions(boardId, { neighborScope });

export const useBoardDetail = (
  boardId: number,
  neighborScope: v2ApiModel.GetBoardNeighborScope = "type",
) =>
  v2Api.useGetBoardSuspense(
    boardId,
    { neighborScope },
    { query: { select: (response) => response.data } },
  ).data;
