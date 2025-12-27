import Carousel from "@/components/layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { Suspense } from "react";
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
