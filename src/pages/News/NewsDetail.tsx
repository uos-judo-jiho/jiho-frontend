import React from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import NewsJson from "../../assets/jsons/news.json";
import SheetWrapper from "../../layouts/SheetWrapper";
import NewsIndex from "../../components/News/NewsIndex";
import Title from "../../layouts/Title";
import MyHelmet from "../../helmet/MyHelmet";

type TParams = {
  id: string;
};

function NewsDetail() {
  const { id } = useParams<TParams>();
  const news = NewsJson.news.find((newsjson) => newsjson.year === id);
  if (!news) return <></>;
  console.log(news);

  return (
    <>
      <MyHelmet helmet="News" />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"지호지"} color="black" />
          <NewsIndex articles={news.articles} images={news.images} />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default NewsDetail;
