import React from "react";
import styled from "styled-components";
import SheetWrapper from "../../../layouts/SheetWrapper";

import HomeCard from "./HomeCard";

import HomeCardsJson from "../../../assets/jsons/homeCards.json";

const Container = styled.div`
  /* background-color: ${(props) => props.theme.accentColor}; */
`;
const RepeatContainer = styled.div`
  min-height: 320px;
  display: grid;
  grid-template-columns: repeat(3, calc(33.3333% - 20px));
  grid-gap: 30px;
  margin: -140px auto 60px 0;
`;

const RepeatedCard = styled.div`
  background-color: ${(props) => props.theme.greyColor};
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
