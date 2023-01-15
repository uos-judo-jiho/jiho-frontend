import React from "react";
import HomeSectionBG from "../HomeSectionBG";
import BGImage from "../../../assets/images/news-demo1.png";
import styled from "styled-components";

const Title = styled.h1``;

function HomeSectionNews() {
  return (
    <HomeSectionBG bgImageSrc={BGImage} id="sectionNews">
      <>
        <Title>2022년 지호지</Title>
      </>
    </HomeSectionBG>
  );
}

export default HomeSectionNews;
