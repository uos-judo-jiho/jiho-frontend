import axios from "axios";
import { Constants } from "../constant/constant";
import { ArticleInfoType } from "../types/ArticleInfoType";

const methodUrl = "api/trainings/";

export const getTrainings = async (
  year: string
): Promise<ArticleInfoType[]> => {
  return await axios
    .get<{ trainingLogs: ArticleInfoType[] }>(
      Constants.BASE_URL + methodUrl + year
    )
    .then((response) => response.data.trainingLogs);
};
