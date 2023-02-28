import axios from "axios";
import { Constants } from "../constant/constant";

export async function getTraining() {
  const methodUrl = "";
  await axios
    .get(Constants.AWS_BASE_URL + methodUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
