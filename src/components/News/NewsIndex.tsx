import React from "react";
import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

function NewsIndex() {
  return (
    <>
      <Carousel></Carousel>
      <NewsCardContainer>
        <NewsCard />
        <NewsCard />
      </NewsCardContainer>
    </>
  );
}

export default NewsIndex;
