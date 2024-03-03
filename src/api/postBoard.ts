import axios from "axios";
import { Constants } from "../constant/constant";
import { ArticleType } from "../components/admin/form/Type/ArticleType";
import { toBase64 } from "../utils/Utils";

const methodUrl = "api/upload/";
export async function postBoard(
  boardType: "news" | "training" | "notice",
  data: ArticleType
) {
  try {
    const images: string[] = [];

    for await (const imgs of data.images) {
      const imgBase64 = await toBase64(imgs);
      if (typeof imgBase64 === "string") {
        images.push(imgBase64);
      }
    }

    const res = await axios
      .post(Constants.BASE_URL + methodUrl, {
        title: data.title,
        author: data.author,
        description: data.description,
        dateTime: data.dateTime,
        tags: data.tags,
        boardType: boardType,
        image: images,
      })
      .then((response) => {
        if (response.data.status === 200) {
          return response.data;
        }
      })
      .catch((error) => error);

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
}
