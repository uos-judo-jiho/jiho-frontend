import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import axiosInstance from "../../config";

const METHOD_URL = "/api/admin/board";

export type BoardType = "news" | "training" | "notice";

export interface CreateBoardRequest {
  title: string;
  author: string;
  boardType: BoardType;
  dateTime: string;
  description: string;
  tags: string[];
  base64Imgs: string[];
}

export interface UpdateBoardRequest extends CreateBoardRequest {
  id: string;
}

/**
 * Create board
 * @description
 * ```bash
 * curl BASE_URL/api/admin/board/
 * -X POST
 * -d '{
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
export const createBoard = async (
  articleInfo: Omit<ArticleInfoType, "id">,
  boardType: BoardType,
): Promise<void> => {
  await axiosInstance({
    url: METHOD_URL,
    method: "POST",
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
  console.log("[updateBoard] Request details:", {
    url: `${METHOD_URL}/${articleInfo.id}`,
    boardType,
    imgSrcsCount: articleInfo.imgSrcs.length,
    imgSrcsTypes: articleInfo.imgSrcs.map((src) =>
      src.startsWith("data:") ? "base64" : "url",
    ),
  });

  await axiosInstance({
    url: `${METHOD_URL}/${articleInfo.id}`,
    method: "PUT",
    data: {
      id: articleInfo.id,
      title: articleInfo.title,
      author: articleInfo.author,
      boardType,
      dateTime: articleInfo.dateTime,
      description: articleInfo.description,
      tags: articleInfo.tags,
      base64Imgs: articleInfo.imgSrcs,
    },
  });

  console.log("[updateBoard] Success");
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
  await axiosInstance({
    url: `${METHOD_URL}/${id}`,
    method: "DELETE",
  });
};
