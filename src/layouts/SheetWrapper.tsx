import React from "react";
import styled from "styled-components";

type SheetWrapperProps = {
  children: React.ReactNode;
};

const Container = styled.div`
  position: relative;
  margin: 0 auto;

  @media (min-width: 1800px) {
    width: 1780px;
  }
  @media (min-width: 1200px) and (max-width: 1799px) {
    width: 1140px;
  }
  @media (max-width: 575px) {
    width: 340px;
  }
`;

function SheetWrapper({ children }: SheetWrapperProps) {
  return <Container>{children}</Container>;
}

export default SheetWrapper;
