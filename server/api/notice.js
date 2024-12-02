import axiosInstance from "./config";

const METHOD_URL = "api/notices";

export const getNotices = async () => {
  return await axiosInstance({
    url: METHOD_URL,
    method: "GET",
    withCredentials: true,
  })
    .then((response) => response.data.notices)
    .catch((err) => {
      console.error(err);
      return [];
    });
};
