import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { ArticleInfoType } from "../../types/ArticleInfoType";

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
};

function NewsIndex({ articles, images }: NewsIndexProps) {
  return (
    <>
      <Carousel datas={images}></Carousel>
      <NewsCardContainer>
        {/* TODO infinite scroll 구현하기 */}
        {articles.map((item, index) => {
          return (
            <NewsCard key={"news" + item.id} index={index} datas={articles} />
          );
        })}
      </NewsCardContainer>
    </>
  );
}

export default NewsIndex;
