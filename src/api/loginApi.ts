import axios from "axios";
import { Constants } from "../constant/constant";

export async function loginApi(id: string, password: string) {
  const methodUrl = "api/login";

  const formData = new FormData();
  formData.append("email", id);
  formData.append("password", password);

  const config = {
    headers: {
      "content-type": "form-data",
    },
  };

  return await axios
    .post(Constants.BASE_URL + methodUrl, formData)
    .then((response) => response)
    .catch((error) => error);
}
