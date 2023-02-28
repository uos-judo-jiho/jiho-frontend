import styled from "styled-components";
import BGImage from "../../../assets/images/background-img-mono.jpg";
import Title from "../../../layouts/Title";
import HomeSectionBG from "../HomeSectionBG";

import { Link } from "react-router-dom";
import SheetWrapper from "../../../layouts/SheetWrapper";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SeeMore = styled.p`
  color: ${(props) => props.theme.greyColor};
  margin-top: 0.5rem;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
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
            <TextWrapper>
              <Title title={"2022년 지호지"} />
              <SeeMore>자세히 보기</SeeMore>
            </TextWrapper>
          </SheetWrapper>
        </HomeSectionBG>
      </Link>
    </Container>
  );
}

export default HomeSectionNews;
