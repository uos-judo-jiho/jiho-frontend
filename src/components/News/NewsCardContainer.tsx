import React from "react";
import styled from "styled-components";
import Row from "../../layouts/Row";

type NewsCardContainerProps = {
  children: React.ReactNode;
};

const Container = styled.div`
  width: 100%;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
`;

function NewsCardContainer({ children }: NewsCardContainerProps) {
  return (
    <Container>
      <GridWrapper>{children}</GridWrapper>
    </Container>
  );
}

export default NewsCardContainer;
