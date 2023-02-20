import React from "react";
import { Link } from "react-scroll";
import styled from "styled-components";
import Col from "../../../layouts/Col";
import OutlineButton from "../../Buttons/OutlineButton";

type HomeCardProps = {
  icon: string;
  title: string;
  description: string;
  scrollTo: string;
};

const Container = styled.div`
  padding: 30px;
`;
const IconWrapper = styled.span``;
const CardTitle = styled.h3`
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin: 20px 0 0;
`;
const CardDescription = styled.p`
  margin: 30px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2em;
  height: 3.6em;
`;
const MoreBtnWrapper = styled.div`
  margin: 20px 0 0;
`;

function HomeCard({ icon, title, description, scrollTo }: HomeCardProps) {
  return (
    <Container>
      <Col>
        <IconWrapper>{icon}</IconWrapper>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <Link to={scrollTo} spy={true} smooth={true}>
          <MoreBtnWrapper>
            <OutlineButton text={"더 알아보기"} />
          </MoreBtnWrapper>
        </Link>
      </Col>
    </Container>
  );
}

export default HomeCard;
