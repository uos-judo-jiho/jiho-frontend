import styled from "styled-components";
import { Constants } from "../../../constant/constant";
import SheetWrapper from "../../../layouts/SheetWrapper";
import Title from "../../../layouts/Title";
import MoreCard from "./MoreCard";

const Container = styled.div``;

const GridContainer = styled.div`
  display: grid;
  width: 100%;

  padding-top: 2rem;

  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  @media (max-width: 539px) {
    grid-template-columns: none;
    grid-template-rows: repeat(3, 1fr);
  }
`;

function HomeSectionMore() {
  return (
    <SheetWrapper>
      <Container>
        <Title title={"개시글 전체보기"} color={Constants.LOGO_BLACK} />
        <GridContainer>
          {/* <MoreCard
            title="공지사항"
            description="공지사항 보러가기"
            linkTo="/notice"
          />
          <MoreCard
            title="훈련일지"
            description="훈련일지 보러가기"
            linkTo="/photo"
          />
          <MoreCard
            title="지호지"
            description="지호지 보러가기"
            linkTo="/news/2022"
          /> */}
        </GridContainer>
      </Container>
    </SheetWrapper>
  );
}

export default HomeSectionMore;
