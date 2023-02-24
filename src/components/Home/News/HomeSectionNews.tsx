import React from "react";
import HomeSectionBG from "../HomeSectionBG";
import BGImage from "../../../assets/images/background-img-mono.jpg";
import styled from "styled-components";
import NewsRowContainer from "./NewsRowContainer";
import NewsCard from "./NewsCard";
import Row from "../../../layouts/Row";
import Title from "../../../layouts/Title";

import ImgSrc from "../../../assets/images/background-img-group.jpg";

import Executives from "../../../assets/jsons/executives.json";
import Graduates from "../../../assets/jsons/graduates.json";
import Freshmen from "../../../assets/jsons/freshmen.json";
import SheetWrapper from "../../../layouts/SheetWrapper";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

function HomeSectionNews() {
  return (
    <Container>
      <Link to={"/news/2022"}>
        <HomeSectionBG
          bgImageSrc={BGImage}
          id="sectionNews"
          backgroundCover={false}
        >
          <SheetWrapper>
            <Title title={"2022년 지호지"} color={"#eee"} />
          </SheetWrapper>
        </HomeSectionBG>
      </Link>
    </Container>
  );
}

export default HomeSectionNews;
