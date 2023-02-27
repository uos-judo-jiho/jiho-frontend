import axios from "axios";

export async function getNews() {
  await axios
    .get("")
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
