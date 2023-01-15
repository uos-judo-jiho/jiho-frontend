import React from "react";
import styled from "styled-components";
import Col from "../../../layouts/Col";

const ImgContainer = styled.img``;
const ImgWrapper = styled.div`
  width: 100px;
  height: 100px;
`;
const Title = styled.p``;
const Subtitle = styled.p``;

function NewsCard() {
  return (
    <Col>
      <ImgWrapper>
        <ImgContainer />
      </ImgWrapper>
      <Title>2022년 상반기 회장</Title>
      <Subtitle>김석균</Subtitle>
    </Col>
  );
}

export default NewsCard;
