import axios from "axios";
import { Constants } from "../constant/constant";
import { ValuesType } from "../components/admin/form/Type/ArticleType";

const methodUrl = "api/upload/";
export async function postBoard(boardType: string, data: ValuesType) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("author", data.author);
  formData.append("description", data.description);
  formData.append("dateTime", data.dateTime);
  data.tags.forEach((tag) => {
    formData.append("tags[]", tag);
  });
  data.images.forEach((src) => {
    formData.append("imgSrcs[]", src);
  });

  formData.append("boardType", boardType);

  const config = {
    headers: {
      "content-type": "form-data",
    },
  };
  try {
    const res = await axios
      .post(Constants.BASE_URL + methodUrl, formData, config)
      .then((response) => response.data);
    return res;
  } catch (error) {
    console.error(error);
  }
}
