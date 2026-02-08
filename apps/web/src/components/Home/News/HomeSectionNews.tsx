import BGImage from "@/shared/lib/assets/images/background-img-mono.jpg";
import BGImageWebp from "@/shared/lib/assets/images/background-img-mono.webp";

import Title from "@/components/layouts/Title";
import HomeSectionBG from "../HomeSectionBG";

import SheetWrapper from "@/components/layouts/SheetWrapper";
import { useLatestNews } from "@/features/seo/news/hooks/use-latest-news";
import { Link } from "react-router-dom";

const HomeSectionNews = () => {
  const { lastestNewsYear } = useLatestNews();

  return (
    <section className="w-full h-full">
      <Link to={`/news/${lastestNewsYear}`}>
        <HomeSectionBG
          bgImageSrc={BGImage}
          bgImageSrcWebp={BGImageWebp}
          bgImageAlt="news-background"
          id="sectionNews"
          backgroundCover={false}
        >
          <SheetWrapper>
            <div className="w-full h-full flex flex-col items-center">
              <Title title={`${lastestNewsYear}년 지호지`} heading={2} />
              <p className="text-white text-theme-default mt-1 opacity-60 hover:opacity-100 xs:opacity-100 xs:text-theme-bg">
                자세히 보기
              </p>
            </div>
          </SheetWrapper>
        </HomeSectionBG>
      </Link>
    </section>
  );
};

export default HomeSectionNews;
