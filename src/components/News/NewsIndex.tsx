import Carousel from "@/components/layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import { ClientOnly } from "../ClientOnly";
import SkeletonThumbnail from "../common/Skeletons/SkeletonThumbnail";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
  selectedIndex?: number;
  index: string;
  year: string;
};

const NewsIndex = ({
  articles,
  images,
  selectedIndex,
  year,
}: NewsIndexProps) => {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-center text-gray-500">{`${year}년 지호지 뉴스가 없습니다.`}</p>
        <Link to="/news" className="text-blue-500 hover:underline">
          다른 연도 뉴스 보러가기
        </Link>
      </div>
    );
  }

  return (
    <>
      <ClientOnly>
        <Carousel datas={images}></Carousel>
      </ClientOnly>
      <NewsCardContainer>
        {articles.map((article) => (
          <Suspense key={article.id} fallback={<SkeletonThumbnail />}>
            <NewsCard
              key={article.id}
              year={year}
              article={article}
              selectedIndex={selectedIndex}
            />
          </Suspense>
        ))}
      </NewsCardContainer>
    </>
  );
};

export default NewsIndex;
