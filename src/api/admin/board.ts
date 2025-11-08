import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import axiosInstance from "../config";
import axios from "axios";

const METHOD_URL = "/api/admin/board";

/**
 * Create board
 * @description
 * ```bash
 * curl BASE_URL/api/admin/board/
 * -X POST 
 * -d '{
        title: articleInfo.title,
        author: articleInfo.author,
        boardType,
        dateTime: articleInfo.dateTime,
        description: articleInfo.description,
        tags: articleInfo.tags,
        base64Imgs: articleInfo.imgSrcs,
      }'
  ```
 */
export const uploadBoard = async (
  articleInfo: Omit<ArticleInfoType, "id">,
  boardType: "news" | "training" | "notice"
): Promise<boolean> => {
  try {
    const res = await axiosInstance({
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
    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Update board 
 * @description
 * ```bash
 * curl BASE_URL/api/admin/board/${id}
 * -X PUT 
 * -d '{
        title: articleInfo.title,
        author: articleInfo.author,
        boardType,
        dateTime: articleInfo.dateTime,
        description: articleInfo.description,
        tags: articleInfo.tags,
        base64Imgs: articleInfo.imgSrcs,
      }'
  ```
 */
export const updateBoard = async (
  articleInfo: ArticleInfoType,
  boardType: "news" | "training" | "notice"
) => {
  console.log("[updateBoard] Request details:", {
    url: `${METHOD_URL}/${articleInfo.id}`,
    boardType,
    imgSrcsCount: articleInfo.imgSrcs.length,
    imgSrcsTypes: articleInfo.imgSrcs.map((src) =>
      src.startsWith("data:") ? "base64" : "url"
    ),
  });

  try {
    const res = await axiosInstance({
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

    console.log("[updateBoard] Success:", res.status);
    if (res) {
      return true;
    }
    return false;
  } catch (error: unknown) {
    console.error("[updateBoard] Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("[updateBoard] Response:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      });
    }
    return false;
  }
};

/**
 * Delete board
 * @description
 * ```bash
 * curl BASE_URL/api/admin/board/${id}
 * -X DELETE
  ```
 */
export const deleteBoard = async (id: string) => {
  try {
    const res = await axiosInstance({
      url: `${METHOD_URL}/${id}`,
      method: "DELETE",
    });

    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
