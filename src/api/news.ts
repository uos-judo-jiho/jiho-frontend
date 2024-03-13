import { NewsType } from "../types/NewsType";
import axiosInstance from "./config";

const METHOD_URL = "api/news";
export const getNews = async (year: string) => {
  return await axiosInstance<NewsType>({
    url: `${METHOD_URL}/${year}`,
    method: "GET",
    withCredentials: true,
  }).then((response) => response.data);
};
