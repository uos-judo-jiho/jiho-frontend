import axios from "axios";
import { Constants } from "../constant/constant";
import { ArticleInfoType } from "../types/ArticleInfoType";

const methodUrl = "api/notices";

export const getNotices = async (): Promise<ArticleInfoType[]> => {
  return await axios
    .get<{ noticeLogs: ArticleInfoType[] }>(`${Constants.BASE_URL}${methodUrl}`)
    .then((response) => response.data.noticeLogs);
};
