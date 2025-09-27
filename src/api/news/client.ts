import { NewsType } from "@/lib/types/NewsType";
import { loadPrerenderedNewsData } from "@/lib/utils/Utils";
import axiosInstance from "../config";

const METHOD_URL = "api/news";

export const getNews = async (year: string): Promise<NewsType | null> => {
  // 프로덕션에서만 SSG 데이터 시도
  if (typeof window !== "undefined") {
    const prerenderedData = await loadPrerenderedNewsData(year);
    if (prerenderedData) {
      console.log(`[SSG] Using prerendered news data for ${year}`);
      return prerenderedData;
    }
  }

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
