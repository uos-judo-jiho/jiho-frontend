import axios from "axios";
import { Constants } from "../../constant/constant";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import { Cookies } from "react-cookie";

const methodUrl = "api/admin/upload/";

/**
 * Create board
 * @description
 * ```bash
 * curl BASE_URL/api/admin/upload/
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
    const res = await axios.post(
      `${Constants.BASE_URL}${methodUrl}`,
      {
        title: articleInfo.title,
        author: articleInfo.author,
        boardType,
        dateTime: articleInfo.dateTime,
        description: articleInfo.description,
        tags: articleInfo.tags,
        base64Imgs: articleInfo.imgSrcs,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
        },
        withCredentials: true,
      }
    );
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
 * curl BASE_URL/api/admin/upload/
 * -X PATCH 
 * -d '{
 *      id: articleInfo.id,
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
    const res = await axios.patch(
      `${Constants.BASE_URL}${methodUrl}`,
      {
        id: articleInfo.id,
        title: articleInfo.title,
        author: articleInfo.author,
        boardType,
        dateTime: articleInfo.dateTime,
        description: articleInfo.description,
        tags: articleInfo.tags,
        base64Imgs: articleInfo.imgSrcs,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
        },
        withCredentials: true,
      }
    );
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
 * curl BASE_URL/api/admin/upload/
 * -X DELETE 
 * --data "id=id&board=boardType"
  ```
 */
export const deleteBoard = async (
  id: string,
  boardType: "news" | "training" | "notice"
) => {
  const cookies = new Cookies();
  try {
    const res = await axios.delete(
      `${Constants.BASE_URL}${methodUrl}?id=${id}&board=${boardType}`,
      {
        headers: {
          Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
        },
        withCredentials: true,
      }
    );
    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
