import React from "react";
import styled from "styled-components";
import Col from "../../layouts/Col";
import Line from "../../layouts/Line";
import SheetWrapper from "../../layouts/SheetWrapper";

const ContainerWrapper = styled.div`
  display: flex;
  width: 508px;
  min-height: 480px;
  height: auto;
  margin: 0 0 60px auto;
  padding-top: 60px;
`;

const Container = styled.div`
  padding: 30px;
  position: relative;
  flex: 1;
  max-width: 100%;
  border: 2px solid ${(props) => props.theme.greyColor};
`;

const SubTitle = styled.h4`
  font-size: 2.25rem;
  letter-spacing: 7px;
  text-transform: none;
  font-weight: 400;
  margin: 0;
  color: ${(props) => props.theme.greyColor};
`;

const Title = styled.h1`
  text-transform: uppercase;
  font-family: sans-serif;
  font-size: 5.5rem;
  font-weight: 500;
  margin: 10px 0 0;
  color: ${(props) => props.theme.greyColor};
`;

function HomeTitle() {
  return (
    <SheetWrapper>
      <ContainerWrapper>
        <Container>
          <SubTitle>서울시립대학교 유도부</SubTitle>
          <Title>지호</Title>
          <Line />
        </Container>
      </ContainerWrapper>
    </SheetWrapper>
  );
}

export default HomeTitle;
