import React from "react";
import styled from "styled-components";
import Col from "../../layouts/Col";
import Row from "../../layouts/Row";

type CardRowContainerProps = {
  title: string;
  children: React.ReactNode;
  isRow?: boolean;
};

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

const Title = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
`;

function CardRowContainer({ title, isRow = true, children }: CardRowContainerProps) {
  return (
    <Container>
      <Col>
        <Title>{title}</Title>
        {isRow ? <Row>{children}</Row> : <Col>{children}</Col>}
      </Col>
    </Container>
  );
}

export default CardRowContainer;
