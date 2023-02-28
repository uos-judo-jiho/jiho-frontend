import axios from "axios";

export async function getNews() {
  const methodUrl = "/news";
  await axios
    .get(methodUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
