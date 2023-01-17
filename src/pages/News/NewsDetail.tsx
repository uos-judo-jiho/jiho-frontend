import React from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import NewsJson from "../../assets/jsons/graduates.json";

type TParams = {
  id: string;
};

function NewsDetail() {
  const { id } = useParams<TParams>();
  const news = NewsJson.graduates.find((newsjson) => newsjson.id === id);
  if (!news) return <></>;
  console.log(news);

  return <DefaultLayout>{[news.id, news.title, news.subTitle]}</DefaultLayout>;
}

export default NewsDetail;
