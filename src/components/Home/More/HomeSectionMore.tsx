import styled from "styled-components";
import { Constants } from "../../../constant/constant";
import SheetWrapper from "../../../layouts/SheetWrapper";
import Title from "../../../layouts/Title";
import MoreCard from "./MoreCard";

const GridContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
  @media (max-width: 539px) {
    grid-template-columns: none;
    grid-template-rows: repeat(2, 1fr);
  }
`;

function HomeSectionMore() {
  return (
    <SheetWrapper>
      <Title title={"More"} color={Constants.LOGO_BLACK} />

      <GridContainer>
        {/* <MoreCard
          title="공지사항"
          description="공지사항 보러가기"
          linkTo="/notice"
          dataTitles={[""]}
        /> */}
        <MoreCard
          title="훈련일지"
          description="훈련일지 보러가기"
          linkTo="/photo"
        />
        <MoreCard
          title="지호지"
          description="지호지 보러가기"
          linkTo="/news/2022"
        />
      </GridContainer>
    </SheetWrapper>
  );
}

export default HomeSectionMore;
