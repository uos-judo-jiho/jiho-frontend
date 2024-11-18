import { ArticleInfoType } from "../types/ArticleInfoType";
import axiosInstance from "./config";

const METHOD_URL = "api/trainings";

export const getTrainings = async (year?: string): Promise<ArticleInfoType[]> => {
  return await axiosInstance<{ trainingLogs: ArticleInfoType[] }>({
    url: `${METHOD_URL}`,
    params: { year },
    method: "GET",
    withCredentials: true,
  }).then((response) => response.data.trainingLogs);
};
