import axios from "axios";
import { Constants } from "../constant/constant";
import { TrainingLogsType } from "../types/ArticleInfoType";

const methodUrl = "api/trainings/";
export async function getTrainings(year: string) {
  return await axios
    .get<TrainingLogsType>(Constants.BASE_URL + methodUrl + year)
    .then((response) => response.data);
}

export async function postTraining() {}
