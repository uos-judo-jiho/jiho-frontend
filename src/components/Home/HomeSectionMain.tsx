import styled from "styled-components";
import HomeSectionBG from "./HomeSectionBG";
import HomeTitle from "./HomeTitle";

const RepeatContainer = styled.div`
  min-height: 320px;
  display: grid;
  grid-template-columns: repeat(3, calc(33.3333% - 20px));
  grid-gap: 30px;
  margin: -40px auto 60px 0;
`;

const RepeatedCard = styled.div`
  border: 2px solid ${(props) => props.theme.greyColor};
`;

function HomeSectionMain() {
  return (
    <>
      <HomeSectionBG>
        <HomeTitle />
        <RepeatContainer>
          <RepeatedCard></RepeatedCard>
          <RepeatedCard></RepeatedCard>
          <RepeatedCard></RepeatedCard>
        </RepeatContainer>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionMain;
