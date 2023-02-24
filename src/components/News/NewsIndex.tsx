import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

// TODO 데이터 바꾸기
import { ArticleInfoTpye } from "../../types/ArticleInfoTpye";

type NewsIndexProps = {
  articles: ArticleInfoTpye[];
  images: string[];
};

function NewsIndex({ articles, images }: NewsIndexProps) {
  return (
    <>
      <Carousel datas={images}></Carousel>
      <NewsCardContainer>
        {/* TODO 뉴스 데이터로 교체하기 */}
        {/* TODO infinite scroll 구현하기 */}
        {articles.map((item, index) => {
          return <NewsCard key={item.id} index={index} datas={articles} />;
        })}
      </NewsCardContainer>
    </>
  );
}

export default NewsIndex;
