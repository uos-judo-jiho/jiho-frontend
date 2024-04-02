import React from "react";
import styled from "styled-components";

type NewsCardContainerProps = {
  children: React.ReactNode;
};

const Container = styled.div`
  width: 100%;
`;

const GridWrapper = styled.div`
  display: grid;

  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: 1fr;
    grid-gap: 24px;
  }

  @media (max-width: 539px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }
`;

const NewsCardContainer = ({ children }: NewsCardContainerProps) => {
  return (
    <Container>
      <GridWrapper>{children}</GridWrapper>
    </Container>
  );
};

export default NewsCardContainer;
