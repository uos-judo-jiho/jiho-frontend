import React from "react";
import styled from "styled-components";
import Col from "../../../layouts/Col";
import Row from "../../../layouts/Row";
import NewsCard from "./NewsCard";

type NewsRowContainerProps = {
  title: string;
  children: React.ReactNode;
  isRow?: boolean;
};

const Container = styled.div`
  margin: 10px 0;
`;

const Title = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
`;

function NewsRowContainer({
  title,
  isRow = true,
  children,
}: NewsRowContainerProps) {
  return (
    <Container>
      <Col>
        <Title>{title}</Title>
        {isRow ? <Row>{children}</Row> : <Col>{children}</Col>}
      </Col>
    </Container>
  );
}

export default NewsRowContainer;
