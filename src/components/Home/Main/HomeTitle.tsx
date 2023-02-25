import styled from "styled-components";
import Line from "../../../layouts/Line";
import SheetWrapper from "../../../layouts/SheetWrapper";

const ContainerWrapper = styled.div`
  display: flex;
  width: 30vw;
  min-height: 30vw;
  height: auto;
  margin: 0 0 60px auto;
  padding-top: 60px;

  @media (max-width: 859px) {
    width: 100%;
  }
`;

const Container = styled.div`
  padding: 30px;
  position: relative;
  flex: 1;
  max-width: 100%;
  border: 2px solid ${(props) => props.theme.lightGreyColor};
`;

const SubTitle = styled.h4`
  font-size: 2.25rem;
  letter-spacing: 7px;
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
        {/* <Line
            width={"100%"}
            margin={"1rem auto 0 0"}
            borderWidth={"0.5rem"}
          /> */}
      </Container>
    </ContainerWrapper>
  );
}

export default HomeTitle;
