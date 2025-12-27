import BGImage from "@/shared/lib/assets/images/background-img-mono.jpg";
import BGImageWebp from "@/shared/lib/assets/images/background-img-mono.webp";

import Title from "@/components/layouts/Title";
import HomeSectionBG from "../HomeSectionBG";

import SheetWrapper from "@/components/layouts/SheetWrapper";
import { Constants } from "@/shared/lib/constant";
import { Link } from "react-router-dom";

const HomeSectionNews = () => {
  return (
    <section className="w-full h-full">
      <Link to={`/news/${Constants.LATEST_NEWS_YEAR}`}>
        <HomeSectionBG
          bgImageSrc={BGImage}
          bgImageSrcWebp={BGImageWebp}
          bgImageAlt="news-background"
          id="sectionNews"
          backgroundCover={false}
        >
          <SheetWrapper>
            <div className="w-full h-full flex flex-col items-center">
              <Title
                title={`${Constants.LATEST_NEWS_YEAR}년 지호지`}
                heading={2}
              />
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
