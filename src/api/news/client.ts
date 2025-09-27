import { NewsType } from "@/lib/types/NewsType";
import axiosInstance from "../config";

const METHOD_URL = "api/news";

export const getNews = async (year: string): Promise<NewsType | null> => {
  return await axiosInstance<NewsType>({
    url: `/${METHOD_URL}/${year}`,
    method: "GET",
    withCredentials: true,
  })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};
