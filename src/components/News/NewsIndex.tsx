import React from "react";
import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

function NewsIndex() {
  return (
    <>
      <Carousel></Carousel>
      <NewsCardContainer>
        <NewsCard index={0} />
        <NewsCard index={1} />
      </NewsCardContainer>
    </>
  );
}

export default NewsIndex;
