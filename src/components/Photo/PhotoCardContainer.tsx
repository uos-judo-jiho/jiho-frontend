import React from "react";
import styled from "styled-components";
type PhotoCardContainerProps = {
  children: React.ReactNode;
};

const GridContainer = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (min-width: 1800px) {
    grid-gap: 30px;
    margin-bottom: 30px;
  }
  @media (min-width: 1200px) and (max-width: 1799px) {
    grid-gap: 20px;
    margin-bottom: 20px;
  }
  @media (min-width: 860px) and (max-width: 1199px) {
    grid-gap: 10px;
    margin-bottom: 10px;
  }
  @media (max-width: 859px) {
    grid-gap: 8px;
    margin-bottom: 8px;
  }
`;

function PhotoCardContainer({ children }: PhotoCardContainerProps) {
  return <GridContainer>{children}</GridContainer>;
}

export default PhotoCardContainer;
