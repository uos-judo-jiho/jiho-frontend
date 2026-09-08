import { v2Api } from "@packages/api";
import type { v2ApiModel } from "@packages/api/model";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";

/**
 * 게시판 목록 조회.
 *
 * 지호지·훈련일지·공지는 서버에서 `GET /api/v2/boards?type=` 하나로 합쳐졌고,
 * 옛 `/trainings`·`/notices`·`/news/{year}` 는 deprecated 다 (api#41).
 * 목록 응답은 축약 스키마(BoardSummary)라 마크다운 본문과 사진 전부를 싣지
 * 않는다 — 상세·수정 화면은 단건 조회(useBoardDetail)를 쓴다.
 */

/** 한 페이지에 보여주는 글 수. 서버 상한은 100 이다. */
export const BOARD_PAGE_SIZE = 50;

type BoardPageOptions = {
  type: v2ApiModel.ListBoardsType;
  /** 지호지처럼 연도로 나눠 보는 목록에서만 쓴다 */
  year?: number;
  page: number;
};

export const useBoardPage = ({ type, year, page }: BoardPageOptions) =>
  v2Api.useListBoards(
    {
      type,
      ...(year !== undefined && { year }),
      limit: BOARD_PAGE_SIZE,
      offset: page * BOARD_PAGE_SIZE,
    },
    {
      axios: { withCredentials: true },
      query: {
        // 페이지를 넘기는 동안 목록이 사라지지 않게 이전 페이지를 그대로 둔다
        placeholderData: keepPreviousData,
        select: (response) => response.data,
      },
    },
  );

/** 게시글 단건 (본문·사진 전부 + 앞뒤 글). 수정 폼이 쓰는 모양 그대로다. */
export const useBoardDetail = (boardId: number) =>
  v2Api.useGetBoardSuspense(boardId, undefined, {
    axios: { withCredentials: true },
    query: { select: (response) => response.data },
  });

/**
 * 글을 쓰거나 지운 뒤 목록·아카이브·갤러리를 한 번에 무효화한다.
 * 통합 목록이라 게시판별로 키를 나눠 들고 있을 이유가 없어졌다.
 */
export const useInvalidateBoards = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: v2Api.getListBoardsQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: v2Api.getGetNewsArchiveQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: v2Api.getListGalleriesQueryKey(),
      }),
    ]);
};
