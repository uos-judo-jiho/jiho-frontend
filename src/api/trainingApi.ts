import axios from "axios";
import { Constants } from "../constant/constant";
import { ArticleInfoType, TrainingLogsType } from "../types/ArticleInfoType";

export async function getTrainings(year: string) {
  const methodUrl = "api/trainings/" + year;

  return await axios
    .get<TrainingLogsType>(Constants.BASE_URL + methodUrl)
    .then((response) => response.data);
}

export async function postTraining() {}
