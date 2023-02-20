import React from "react";
import styled from "styled-components";

type SheetWrapperProps = {
  children: React.ReactNode;
  paddingTop?: number;
};

const Container = styled.div<SheetWrapperProps>`
  position: relative;
  margin: 0 auto;
  padding-top: ${(props) => props.paddingTop}px;

  @media (min-width: 1800px) {
    width: 1780px;
  }
  @media (min-width: 1200px) and (max-width: 1799px) {
    width: 1140px;
  }
  @media (min-width: 860px) and (max-width: 1199px) {
    width: 800px;
  }
  @media (max-width: 859px) {
    width: 540px;
  }
  @media (max-width: 539px) {
    width: 340px;
  }
`;

function SheetWrapper({ children, paddingTop = 100 }: SheetWrapperProps) {
  return <Container paddingTop={paddingTop}>{children}</Container>;
}

export default SheetWrapper;
