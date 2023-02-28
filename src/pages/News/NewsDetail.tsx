import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewsJson from "../../assets/jsons/news.json";
import NewsIndex from "../../components/News/NewsIndex";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { NewsType } from "../../types/NewsType";

type TParams = {
  id: string;
};

function NewsDetail() {
  const { id } = useParams<TParams>();
  const [news, setNews] = useState<NewsType>();

  useEffect(() => {
    // TODO get API
    const datas = NewsJson;
    const data = datas.news.find((newsjson) => newsjson.year === id);
    setNews(data);
  }, []);

  if (!news) return null;

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
