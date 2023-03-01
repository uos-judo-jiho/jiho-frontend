import axios from "axios";
import { Constants } from "../constant/constant";
import { ArticleInfoType, TrainingLogsType } from "../types/ArticleInfoType";

export async function getTraining() {
  const methodUrl = "api/trainings/2023";

  return await axios
    .get<TrainingLogsType>(Constants.BASE_URL + methodUrl)
    .then((response) => response.data);
}
