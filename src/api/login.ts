import axios from "axios";
import { Constants } from "../constant/constant";

export async function login(values: any) {
  const methodUrl = "api/login";

  try {
    const res = await axios
      .post(Constants.BASE_URL + methodUrl, {
        email: values.username,
        password: values.password,
      })
      .then((response) => response.data)
      .catch((error) => error);
    return res;
  } catch (error) {
    console.error(error);
  }
}
