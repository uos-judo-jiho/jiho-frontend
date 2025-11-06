import styled from "styled-components";

import BGImage from "@/lib/assets/images/background-img-mono.jpg";
import BGImageWebp from "@/lib/assets/images/background-img-mono.webp";

import Title from "@/components/layouts/Title";
import HomeSectionBG from "../HomeSectionBG";

import { Link } from "react-router-dom";
import { Constants } from "@/lib/constant";
import SheetWrapper from "@/components/layouts/SheetWrapper";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SeeMore = styled.p`
  color: ${(props) => props.theme.greyColor};
  font-size: ${(props) => props.theme.defaultFontSize};
  margin-top: 4px;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
  @media (max-width: 539px) {
    opacity: 1;
    color: ${(props) => props.theme.bgColor};
  }
`;

const HomeSectionNews = () => {
  return (
    <Container>
      <Link to={`/news/${Constants.LATEST_NEWS_YEAR}`}>
        <HomeSectionBG bgImageSrc={BGImage} bgImageSrcWebp={BGImageWebp} bgImageAlt="news-background" id="sectionNews" backgroundCover={false}>
          <SheetWrapper>
            <TextWrapper>
              <Title title={`${Constants.LATEST_NEWS_YEAR}년 지호지`} />
              <SeeMore>자세히 보기</SeeMore>
            </TextWrapper>
          </SheetWrapper>
        </HomeSectionBG>
      </Link>
    </Container>
  );
};

export default HomeSectionNews;
