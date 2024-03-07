import axios from "axios";

export async function testApi() {
  const methodUrl = "/login";

  await axios
    .get(methodUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
