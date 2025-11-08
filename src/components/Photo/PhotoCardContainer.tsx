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

  grid-gap: 12px;
  margin-bottom: 4px;
`;

const PhotoCardContainer = ({ children }: PhotoCardContainerProps) => {
  return (
    <FeedContainer>
      <GridContainer>{children}</GridContainer>
    </FeedContainer>
  );
};

export default PhotoCardContainer;
