import React from "react";
import SheetWrapper from "../../../layouts/SheetWrapper";
import { Link } from "react-router-dom";
import CardRowContainer from "../CardRowContainer";
import MoreCard from "./MoreCard";
import styled from "styled-components";
import Title from "../../../layouts/Title";
import { Constants } from "../../../constant/constant";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;
  margin: 1.2rem 6rem;
  @media (max-width: 539px) {
    grid-template-columns: none;
    grid-template-rows: 1fr 1fr 1fr;
  }
`;

function HomeSectionMore() {
  return (
    <SheetWrapper>
      <Title title={"More"} color={Constants.LOGO_BLACK} />

      <GridContainer>
        <MoreCard
          title="공지사항"
          description="공지사항 보러가기"
          linkTo="/notice"
        />
        <MoreCard
          title="공지사항"
          description="공지사항 보러가기"
          linkTo="/notice"
        />
        <MoreCard
          title="공지사항"
          description="공지사항 보러가기"
          linkTo="/notice"
        />
      </GridContainer>
    </SheetWrapper>
  );
}

export default HomeSectionMore;
