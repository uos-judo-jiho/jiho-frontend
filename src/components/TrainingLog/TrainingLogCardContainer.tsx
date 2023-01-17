import React from "react";
import styled from "styled-components";
type TrainingLogCardContainerProps = {
  children: React.ReactNode;
};

const GridContainer = styled.ul`
  min-height: 25vw;
  display: grid;
  grid-template-columns: repeat(3, 25vw);
  grid-gap: 30px;
  margin-bottom: 30px;
`;

function TrainingLogCardContainer({ children }: TrainingLogCardContainerProps) {
  return <GridContainer>{children}</GridContainer>;
}

export default TrainingLogCardContainer;
