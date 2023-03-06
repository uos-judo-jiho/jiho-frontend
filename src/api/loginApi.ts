import axios from "axios";
import { Constants } from "../constant/constant";

export async function loginApi(id: string, password: string) {
  const methodUrl = "api/login/";
  const info = {
    id: id,
    password: password,
  };

  return await axios
    .post(Constants.BASE_URL + methodUrl, { info })
    .then((response) => response)
    .catch((error) => error);
}
