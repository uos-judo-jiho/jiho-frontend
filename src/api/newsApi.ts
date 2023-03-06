import axios from "axios";
import { Constants } from "../constant/constant";
import { NewsType } from "../types/NewsType";

const methodUrl = "api/news/";
export async function getNews(year: string) {
  return await axios
    .get<NewsType>(Constants.BASE_URL + methodUrl + year)
    .then((response) => response.data);
}
