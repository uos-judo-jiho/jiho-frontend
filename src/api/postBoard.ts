import axios from "axios";
import { Constants } from "../constant/constant";
import { ValuesType } from "../components/admin/form/Type/ArticleType";

const methodUrl = "api/upload/";
export async function postBoard(boardType: string, data: ValuesType) {
  const formData = new FormData();
  //   const Srcs = [...data.images];
  //   formData.append(
  //     "pictures",
  //     new Blob([JSON.stringify(Srcs)], { type: "multipart/form-data" })
  //   );
  data.images.forEach((src) => {
    formData.append("pictures", src);
  });

  const jsonFile = {
    title: data.title,
    author: data.author,
    description: data.description,
    dataTime: data.dateTime,
    tags: [...data.tags],
    boardType: boardType,
  };
  //   formData.append("title", data.title);
  //   formData.append("author", data.author);
  //   formData.append("description", data.description);
  //   formData.append("dateTime", data.dateTime);
  //   data.tags.forEach((tag) => {
  //     formData.append("tags", tag);
  //   });
  //   formData.append("boardType", boardType);

  formData.append(
    "uploadBoardDto",
    new Blob([JSON.stringify(jsonFile)], { type: "application/json" })
    // JSON.stringify(jsonFile)
  );
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios
      .post(Constants.BASE_URL + methodUrl, formData, config)
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
