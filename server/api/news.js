import axiosInstance from "./config";

const METHOD_URL = "api/news";
export const getNews = async (year = "2022") => {
  return await axiosInstance({
    url: `${METHOD_URL}/${year}`,
    method: "GET",
    withCredentials: true,
  })
    .then((response) => response.data)
    .catch((err) => {
      console.error(err);
      return null;
    });
};
