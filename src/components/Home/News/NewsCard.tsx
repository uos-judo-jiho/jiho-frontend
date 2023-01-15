import React from "react";
import styled from "styled-components";
import Col from "../../../layouts/Col";

type NewsCardProps = {
  imgSrc: string;
  title: string;
  subTitle: string;
};

const Container = styled.div`
  margin-right: 20px;
`;

const ImgContainer = styled.img`
  width: 100px;
  height: 100px;
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.descriptionFontSize};
  margin: 10px 0;
`;
const Subtitle = styled.p`
  font-size: ${(props) => props.theme.descriptionFontSize};
`;

function NewsCard({ imgSrc, title, subTitle }: NewsCardProps) {
  return (
    <Container>
      <Col>
        <ImgContainer src={imgSrc} />
        <Title>{title}</Title>
        <Subtitle>{subTitle}</Subtitle>
      </Col>
    </Container>
  );
}

export default NewsCard;
