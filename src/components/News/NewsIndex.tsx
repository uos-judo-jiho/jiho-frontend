import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

import { ArticleInfoType } from "../../types/ArticleInfoType";

// TODO remove demo img
import demo1 from "../../assets/images/background-img-event.jpg";
import demo2 from "../../assets/images/background-img-group.jpg";
import demo3 from "../../assets/images/background-img-mono.jpg";
import demo4 from "../../assets/images/background-img-training.jpg";

const demoImgs = [
  demo1,
  demo2,
  demo3,
  demo4,
  demo1,
  demo2,
  demo3,
  demo4,
  demo1,
  demo2,
  demo3,
  demo4,
];

type NewsIndexProps = {
  articles: ArticleInfoType[];
  images: string[];
};

function NewsIndex({ articles, images }: NewsIndexProps) {
  return (
    <>
      <Carousel
        datas={
          // images
          demoImgs
        }
      ></Carousel>
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
