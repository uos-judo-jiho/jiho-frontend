import axios from "axios";
import { Constants } from "../constant/constant";

export async function loginApi(values: any) {
  const methodUrl = "api/login";

  const formData = new FormData();
  formData.append("email", values.username);
  formData.append("password", values.password);

  const config = {
    headers: {
      "content-type": "form-data",
    },
  };

  return await axios
    .post(Constants.BASE_URL + methodUrl, formData)
    .then((response) => response.data)
    .catch((error) => error);
}
