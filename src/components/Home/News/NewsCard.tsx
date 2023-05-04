import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Col from "../../../layouts/Col";

type NewsCardProps = {
  id: string;
  imgSrc: string;
  title: string;
  subTitle: string;
};

const Container = styled.div`
  margin-right: 2rem;
`;

const ImgContainer = styled.img`
  width: 10rem;
  height: 10rem;
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.descriptionFontSize};
  margin: 1rem 0;
`;
const Subtitle = styled.p`
  font-size: ${(props) => props.theme.descriptionFontSize};
`;

function NewsCard({ id, imgSrc, title, subTitle }: NewsCardProps) {
  return (
    <Container>
      <Col>
        <Link to={"/news/" + id}>
          <ImgContainer src={imgSrc} />
          <Title>{title}</Title>
          <Subtitle>{subTitle}</Subtitle>
        </Link>
      </Col>
    </Container>
  );
}

export default NewsCard;
