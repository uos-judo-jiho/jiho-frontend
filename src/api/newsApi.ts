import axios from "axios";
import { Constants } from "../constant/constant";
import { NewsType } from "../types/NewsType";

export async function getNews(year: string) {
  const methodUrl = "api/news/" + year;

  return await axios
    .get<NewsType>(Constants.BASE_URL + methodUrl)
    .then((response) => response.data);
}
