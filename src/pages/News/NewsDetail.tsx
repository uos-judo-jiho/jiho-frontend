import { useParams } from "react-router-dom";
import NewsIndex from "../../components/News/NewsIndex";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { useNews } from "../../recoills/news";
import { TNewsParams } from "../../types/TNewsParams";
import { useEffect } from "react";

function NewsDetail() {
  const { id, index } = useParams<TNewsParams>();
  const { news, fetch } = useNews();

  useEffect(() => {
    fetch();
  }, []);

  const metaDescription = [
    news.year,
    news.articles[0].title,
    news.articles[0].description.slice(0, 80),
  ].join(" | ");

  const metaImgUrl = news.articles[0].imgSrcs[0];

  return (
    <>
      <MyHelmet
        title="News"
        description={metaDescription}
        imgUrl={metaImgUrl}
      />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"지호지"} color="black" />
          <NewsIndex
            articles={news.articles}
            images={news.images}
            selectedIndex={parseInt(index as string)}
          />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default NewsDetail;
