import axios from "axios";

export async function getTraining() {
  await axios
    .get("")
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
