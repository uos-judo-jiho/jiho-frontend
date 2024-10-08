import styled from "styled-components";
import Line from "../../../layouts/Line";

const ContainerWrapper = styled.div`
  display: flex;
  margin: 0 0 60px auto;
  padding-top: 60px;

  @media (max-width: 859px) {
    width: 100%;
  }
`;

const Container = styled.div`
  padding: 24px;
  position: relative;
  flex: 1;
  border: 0.2rem solid ${(props) => props.theme.lightGreyColor};
`;

const SubTitle = styled.h4`
  font-size: ${(props) => props.theme.subTitleFontSize};
  line-height: ${(props) => props.theme.subTitleLineHeight};
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
  font-size: ${(props) => props.theme.titleFontSize};
  line-height: ${(props) => props.theme.titleLineHeight};
  font-weight: 500;
  margin: 10px 0 0;
  color: ${(props) => props.theme.lightGreyColor};
`;

function HomeTitle() {
  return (
    <ContainerWrapper>
      <Container>
        <SubTitle>
          서울시립대학교
          <br />
          유도부
        </SubTitle>
        <Title>지호</Title>
        <Line width={"100%"} margin={"1rem auto 1rem 0"} borderWidth={"0.2rem"} />
        <SubTitle>Uos Judo Team Jiho</SubTitle>
      </Container>
    </ContainerWrapper>
  );
}

export default HomeTitle;
