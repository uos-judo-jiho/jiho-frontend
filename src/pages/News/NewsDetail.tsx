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

const NewsDetail = () => {
  const { id, index } = useParams<TNewsParams>();
  const { news, fetch } = useNews();

  useEffect(() => {
    if (["2022", "2023", "2024"].includes(id?.toString() ?? "") && (news.length === 0 || news.some((newsData) => newsData.year.toString() !== id))) {
      const year = id?.toString() as "2022" | "2023" | "2024" | undefined;
      fetch(year ?? "2022");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const currentPageNews = news.find((newsData) => newsData.year.toString() === id?.toString());

  if (!news) {
    return <Loading />;
  }

  const metaDescription = [currentPageNews?.year, currentPageNews?.articles.at(0)?.title, currentPageNews?.articles.at(0)?.description.slice(0, 80)].join(" | ");

  const metaImgUrl = currentPageNews?.articles.at(0)?.imgSrcs.at(0);

  return (
    <div>
      <MyHelmet title="News" description={metaDescription} imgUrl={metaImgUrl} />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={`${id ?? "2022"}년 지호지`} color="black" />
          <NewsIndex articles={currentPageNews?.articles || []} images={currentPageNews?.images || []} selectedIndex={parseInt(index as string)} index={index ?? ""} year={id ?? "2023"} />
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default NewsDetail;
