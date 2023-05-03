import React from "react";
import styled from "styled-components";
import Row from "../../../layouts/Row";
import { Link } from "react-router-dom";
import Col from "../../../layouts/Col";

type MoreCardProps = {
  title: string;
  description: string;
  linkTo: string;
};

const Card = styled.div`
  width: 100%;
  box-shadow: 0 0.4rem 0.8rem 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  &:hover {
    box-shadow: 0 0.8rem 1.6rem 0 rgba(0, 0, 0, 0.2);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.8rem 1.2rem;
`;

const Title = styled.h1``;

const ItemList = styled.ul`
  width: 100%;
  padding: 0.8rem 0;
`;

const Item = styled.li`
  padding: 0.4rem 0;
`;

const More = styled.p`
  padding-left: 1rem;
  color: ${(props) => props.theme.greyColor};
  &:hover {
    color: ${(props) => props.theme.blackColor};
  }
`;

function MoreCard({ title, linkTo }: MoreCardProps) {
  return (
    <Card>
      <Container>
        <Row alignItems="flex-end" justifyContent="space-between">
          <Title>{title}</Title>
          <Link to={linkTo}>
            <More>+ 더보기</More>
          </Link>
        </Row>
        <ItemList>
          <Item>1</Item>
          <Item>1</Item>
          <Item>1</Item>
          <Item>1</Item>
          <Item>1</Item>
          <Item>1</Item>
          <Item>1</Item>
        </ItemList>
      </Container>
    </Card>
  );
}

export default MoreCard;
