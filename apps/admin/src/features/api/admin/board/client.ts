import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import {
  getDeleteApiV1AdminBoardBoardIdMutationOptions,
  getPostApiV1AdminBoardMutationOptions,
  getPutApiV1AdminBoardBoardIdMutationOptions,
} from "@packages/api/_generated/v1/admin";

export type BoardType = "news" | "training" | "notice";

export const createBoard = async (
  articleInfo: Omit<ArticleInfoType, "id">,
  boardType: BoardType,
): Promise<void> => {
  const { mutationFn } = getPostApiV1AdminBoardMutationOptions({
    axios: {
      withCredentials: true,
    },
  });

  await mutationFn({
    data: {
      title: articleInfo.title,
      author: articleInfo.author,
      boardType,
      dateTime: articleInfo.dateTime,
      description: articleInfo.description,
      tags: articleInfo.tags,
      base64Imgs: articleInfo.imgSrcs,
    },
  });
};

/**
 * Update board
 * @description
 * ```bash
 * curl BASE_URL/api/admin/board/${id}
 * -X PUT
 * -d '{
        id: string,
        title: string,
        author: string,
        boardType: "news" | "training" | "notice",
        dateTime: string,
        description: string,
        tags: string[],
        base64Imgs: string[],
      }'
  ```
 */
export const updateBoard = async (
  articleInfo: ArticleInfoType,
  boardType: BoardType,
): Promise<void> => {
  const boardId = Number(articleInfo.id);
  if (Number.isNaN(boardId)) {
    throw new Error("유효하지 않은 게시글 ID입니다.");
  }

  const { mutationFn } = getPutApiV1AdminBoardBoardIdMutationOptions({
    axios: {
      withCredentials: true,
    },
  });

  await mutationFn({
    boardId,
    data: {
      title: articleInfo.title,
      author: articleInfo.author,
      boardType,
      dateTime: articleInfo.dateTime,
      description: articleInfo.description,
      tags: articleInfo.tags,
      base64Imgs: articleInfo.imgSrcs,
    },
  });
};

/**
 * Delete board
 * @description
 * ```bash
 * curl BASE_URL/api/admin/board/${id}
 * -X DELETE
  ```
 */
export const deleteBoard = async (id: string): Promise<void> => {
  const boardId = Number(id);
  if (Number.isNaN(boardId)) {
    throw new Error("유효하지 않은 게시글 ID입니다.");
  }

  const { mutationFn } = getDeleteApiV1AdminBoardBoardIdMutationOptions({
    axios: {
      withCredentials: true,
    },
  });

  await mutationFn({
    boardId,
  });
};
