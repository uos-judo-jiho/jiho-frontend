import axios from "axios";
import { Constants } from "../constant/constant";

export async function testApi() {
  const methodUrl = "/login";

  await axios
    .get(methodUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
