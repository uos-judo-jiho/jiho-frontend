import axios from "axios";
import { Constants } from "../constant/constant";
import { NewsType } from "../types/NewsType";

export async function getNews() {
  const methodUrl = "api/news/2023";

  return await axios
    .get<NewsType>(Constants.BASE_URL + methodUrl)
    .then((response) => response.data);
}
