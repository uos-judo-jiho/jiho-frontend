import { Cookies } from "react-cookie";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import axiosInstance from "../config";

const METHOD_URL = "api/admin/board";

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
  const cookies = new Cookies();

  try {
    const res = await axiosInstance({
      url: METHOD_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
      },
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
  const cookies = new Cookies();
  try {
    const res = await axiosInstance({
      url: `${METHOD_URL}/${articleInfo.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
      },
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
 * Delete board
 * @description
 * ```bash
 * curl BASE_URL/api/admin/board/${id}
 * -X DELETE
  ```
 */
export const deleteBoard = async (id: string) => {
  const cookies = new Cookies();
  try {
    const res = await axiosInstance({
      url: `${METHOD_URL}/${id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
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
