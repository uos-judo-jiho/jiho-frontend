import React, { useState } from "react";
import NewsForm from "../../components/admin/form/NewsForm";
import Title from "../../layouts/Title";
import { Constants } from "../../constant/constant";
import TrainingLogForm from "../../components/admin/form/TrainingLogForm";

function WriteArticlePage() {
  const pathname = window.location.pathname;
  const [path, setPath] = useState(pathname.split("/")[2]);
  switch (path) {
    case "training":
      return (
        <>
          <Title title={"훈련일지 글쓰기"} color={Constants.BLACK_COLOR} />
          <TrainingLogForm />
        </>
      );
    case "news":
      return (
        <>
          <Title title={"지호지 글쓰기"} color={Constants.BLACK_COLOR} />
          <NewsForm />
        </>
      );

    default:
      return <></>;
      break;
  }
}

export default WriteArticlePage;
