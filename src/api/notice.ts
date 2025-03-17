import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import axiosInstance from "./config";

const METHOD_URL = "api/notices";

export const getNotices = async (): Promise<ArticleInfoType[]> => {
  return await axiosInstance<{ notices: ArticleInfoType[] }>({
    url: METHOD_URL,
    method: "GET",
    withCredentials: true,
  })
    .then((response) => response.data.notices)
    .catch((err) => {
      console.log(err);
      return [];
    });
};
