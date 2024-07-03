import React from "react";
import styled from "styled-components";
type PhotoCardContainerProps = {
  children: React.ReactNode;
};

const FeedContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const GridContainer = styled.ul`
  max-width: 800px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (min-width: 1200px) {
    grid-gap: 10px;
    margin-bottom: 10px;
  }
  @media (min-width: 860px) and (max-width: 1199px) {
    grid-gap: 6px;
    margin-bottom: 6px;
  }
  @media (max-width: 859px) {
    grid-gap: 4px;
    margin-bottom: 4px;
  }
`;

const PhotoCardContainer = ({ children }: PhotoCardContainerProps) => {
  return (
    <FeedContainer>
      <GridContainer>{children}</GridContainer>
    </FeedContainer>
  );
};

export default PhotoCardContainer;
