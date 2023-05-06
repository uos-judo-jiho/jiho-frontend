import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { ArticleInfoType } from "../../types/ArticleInfoType";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
  selectedIndex?: number;
};

function NewsIndex({ articles, images, selectedIndex }: NewsIndexProps) {
  return (
    <>
      <Carousel datas={images}></Carousel>
      <NewsCardContainer>
        {/* TODO infinite scroll 구현하기 */}
        {articles.map((item, index) => {
          return (
            <NewsCard
              key={"news" + item.id}
              index={index}
              datas={articles}
              selectedIndex={selectedIndex}
            />
          );
        })}
      </NewsCardContainer>
    </>
  );
}

export default NewsIndex;
