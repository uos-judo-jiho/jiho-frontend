import styled from "styled-components";
import Line from "../../../layouts/Line";
import SheetWrapper from "../../../layouts/SheetWrapper";

const ContainerWrapper = styled.div`
  display: flex;
  width: 30vw;
  height: 30vw;
  min-width: 35rem;
  min-height: 35rem;
  height: auto;
  margin: 0 0 6rem auto;
  padding-top: 6rem;

  @media (max-width: 859px) {
    width: 100%;
  }
`;

const Container = styled.div`
  padding: 3rem;
  position: relative;
  flex: 1;
  max-width: 100%;
  border: 0.2rem solid ${(props) => props.theme.lightGreyColor};
`;

const SubTitle = styled.h4`
  font-size: 3.5rem;
  letter-spacing: 0.7rem;
  text-transform: none;
  line-height: 120%;
  font-weight: 400;
  margin: 0;
  color: ${(props) => props.theme.lightGreyColor};
`;

const Title = styled.h1`
  text-transform: uppercase;
  font-family: sans-serif;
  font-size: 5.5rem;
  font-weight: 500;
  margin: 10px 0 0;
  color: ${(props) => props.theme.lightGreyColor};
`;

function HomeTitle() {
  return (
    <ContainerWrapper>
      <Container>
        <SubTitle>
          서울시립대학교 <br />
          유도부
        </SubTitle>
        <Title>지호</Title>
        <Line width={"100%"} margin={"1rem auto 0 0"} borderWidth={"0.2rem"} />
      </Container>
    </ContainerWrapper>
  );
}

export default HomeTitle;
