import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewsIndex from "@/components/News/NewsIndex";
import Loading from "@/components/common/Skeletons/Loading";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useNews } from "@/recoils/news";
import { NewsParamsType } from "@/lib/types/NewsParamsType";
import { vaildNewsYearList } from "@/lib/utils/Utils";

const NewsDetail = () => {
  const { id, index } = useParams<NewsParamsType>();
  const { news, fetch } = useNews();

  const naviagate = useNavigate();

  useEffect(() => {
    if (news.some((newsData) => newsData.year.toString() === id?.toString())) {
      return;
    }
    fetch(id);
  }, [fetch, id, news]);

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

  if (!id || !vaildNewsYearList().includes(id)) {
    naviagate(`/news/${vaildNewsYearList().at(-1)}`);
    return <></>;
  }

  return (
    <div>
      <MyHelmet
        title="News"
        description={metaDescription}
        imgUrl={metaImgUrl}
      />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={`${id}년 지호지`} color="black" />
          <NewsIndex
            articles={currentPageNews?.articles || []}
            images={currentPageNews?.images || []}
            selectedIndex={parseInt(index as string)}
            index={index ?? ""}
            year={id}
          />
        </SheetWrapper>
      </DefaultLayout>
    </div>
  );
};

export default NewsDetail;
