import { ArticleInfoType } from "../types/ArticleInfoType";
import axiosInstance from "./config";

const METHOD_URL = "api/notices";

export const getNotices = async (): Promise<ArticleInfoType[]> => {
  return await axiosInstance<{ noticeLogs: ArticleInfoType[] }>({
    url: METHOD_URL,
    method: "GET",
    withCredentials: true,
  }).then((response) => response.data.noticeLogs);
};
