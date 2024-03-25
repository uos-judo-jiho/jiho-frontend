import { useParams } from "react-router-dom";
import NewsIndex from "../../components/News/NewsIndex";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { useNews } from "../../recoills/news";
import { TNewsParams } from "../../types/TNewsParams";
import { useEffect } from "react";
import Loading from "../../components/Skeletons/Loading";

function NewsDetail() {
  const { id, index } = useParams<TNewsParams>();
  const { news, fetch } = useNews();

  useEffect(() => {
    if (["2022", "2023", "2024"].includes(id?.toString() ?? "")) {
      const year = id?.toString() as "2022" | "2023" | "2024" | undefined;
      fetch(year ?? "2022");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPageNews = news.find(
    (newsData) => newsData.year.toString() === id?.toString()
  );

  if (!news) {
    return <Loading />;
  }

  const metaDescription = [
    currentPageNews?.year,
    currentPageNews?.articles.at(0)?.title,
    currentPageNews?.articles.at(0)?.description.slice(0, 80),
  ].join(" | ");

  const metaImgUrl = currentPageNews?.articles.at(0)?.imgSrcs.at(0);

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
            articles={currentPageNews?.articles || []}
            images={currentPageNews?.images || []}
            selectedIndex={parseInt(index as string)}
          />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default NewsDetail;
