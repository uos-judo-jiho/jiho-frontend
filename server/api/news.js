import axiosInstance from "./config";

const METHOD_URL = "api/news";
export const getNews = async (year) => {
  return await axiosInstance({
    url: `${METHOD_URL}/${year}`,
    method: "GET",
    withCredentials: true,
  }).then((response) => response.data);
};
