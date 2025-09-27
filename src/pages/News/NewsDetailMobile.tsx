import MobilePhotoCard from "@/components/Photo/MobilePhotoCard";
import Feed from "@/components/common/Feed/Feed";
import Footer from "@/components/common/Footer/footer";
import MobileHeader from "@/components/common/MobileHeader/MobileHeader";
import Loading from "@/components/common/Skeletons/Loading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NewsDetailPageProps } from "./types/NewsDetailPageProps";

export const NewsDetailMobile = ({
  news,
  year,
  newsId,
}: NewsDetailPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!newsId || !news) {
      return;
    }
    document.getElementById(`news-mobile-card-${newsId}`)?.scrollIntoView();
  }, [newsId, news]);

  const handleCardClick = (articleId: number | string) => {
    navigate(`/news/${year}/${articleId}`);
  };

  if (!news) {
    return <Loading />;
  }

  return (
    <div>
      <MobileHeader
        backUrl={`/news/${year}`}
        subTitle="지호지"
        subTitleUrl={`/news/${year}`}
      />
      <Feed>
        {news.articles.map((newsInfo) => (
          <div
            key={newsInfo.id}
            onClick={() => handleCardClick(newsInfo.id)}
            style={{ cursor: "pointer" }}
          >
            <MobilePhotoCard
              articleInfo={newsInfo}
              id={`news-mobile-card-${newsInfo.id}`}
            />
          </div>
        ))}
      </Feed>
      <Footer />
    </div>
  );
};
