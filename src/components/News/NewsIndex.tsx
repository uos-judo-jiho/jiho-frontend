import { useNavigate } from "react-router-dom";

import Carousel from "@/components/layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import { ClientOnly } from "../ClientOnly";

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
  const navigate = useNavigate();

  const handleClickCard = (index: string) => {
    navigate(`/news/${year}/${index}`);
  };

  return (
    <>
      <ClientOnly>
        <Carousel datas={images}></Carousel>
      </ClientOnly>
      <NewsCardContainer>
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            year={year}
            article={article}
            selectedIndex={selectedIndex}
            handleClickCard={handleClickCard}
          />
        ))}
      </NewsCardContainer>
    </>
  );
};

export default NewsIndex;
