import React from "react";
import styled from "styled-components";
import SheetWrapper from "../../../layouts/SheetWrapper";

import HomeCard from "./HomeCard";

import HomeCardsJson from "../../../assets/jsons/homeCards.json";

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;
const RepeatContainer = styled.div`
  min-height: 320px;
  display: grid;
  grid-template-columns: repeat(3, calc(33.3333% - 20px));
  grid-gap: 30px;
  margin: -30vh auto 0 0;
  padding-bottom: 60px;
`;

const RepeatedCard = styled.div`
  background-color: ${(props) => props.theme.lightGreyColor};
`;

function HomeSectionCards() {
  return (
    <Container>
      <SheetWrapper>
        <RepeatContainer>
          {HomeCardsJson.homeCards.map((homeCard) => {
            return (
              <RepeatedCard key={homeCard.id}>
                <HomeCard
                  icon={homeCard.icon}
                  title={homeCard.title}
                  description={homeCard.description}
                  scrollTo={homeCard.scrollTo}
                />
              </RepeatedCard>
            );
          })}
        </RepeatContainer>
      </SheetWrapper>
    </Container>
  );
}

export default HomeSectionCards;
