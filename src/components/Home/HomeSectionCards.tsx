import React from "react";
import styled from "styled-components";
import SheetWrapper from "../../layouts/SheetWrapper";
import HomeCard from "./HomeCard";

const Container = styled.div`
  /* background-color: ${(props) => props.theme.accentColor}; */
`;
const RepeatContainer = styled.div`
  min-height: 320px;
  display: grid;
  grid-template-columns: repeat(3, calc(33.3333% - 20px));
  grid-gap: 30px;
  margin: -40px auto 60px 0;
`;

const RepeatedCard = styled.div`
  background-color: ${(props) => props.theme.greyColor};
`;

function HomeSectionCards() {
  return (
    <Container>
      <SheetWrapper>
        <RepeatContainer>
          <RepeatedCard>
            <HomeCard
              icon={""}
              title={"ABOUT 지호"}
              description={
                "Club running for those who love to exercise, explore and travel internationally."
              }
              scrollTo={"sectionInfo"}
            />
          </RepeatedCard>
          <RepeatedCard>
            <HomeCard
              icon={""}
              title={"지호지"}
              description={
                "Hatha yoga, which was historically developed in the 1400s, has many benefits, including stress ."
              }
              scrollTo={"sectionNews"}
            />
          </RepeatedCard>
          <RepeatedCard>
            <HomeCard
              icon={""}
              title={"지호운동"}
              description={
                "You'll get individual attention in a fun group setting with other people who know that on life's journey, it's best Hatha yoga, which was historically developed in the 1400s, has many benefits, including stress .Hatha yoga, which was historically developed in the 1400s, has many benefits, including stress ."
              }
              scrollTo={"sectionExercise"}
            />
          </RepeatedCard>
        </RepeatContainer>
      </SheetWrapper>
    </Container>
  );
}

export default HomeSectionCards;
