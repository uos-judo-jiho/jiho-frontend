import axios from "axios";

export async function getTraining() {
  const methodUrl = "/training";
  await axios
    .get(methodUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
