import React from "react";
import styled from "styled-components";
import { MediaLayout } from "../theme/GlobalStyle";

type SheetWrapperProps = {
  children: React.ReactNode;
  paddingTop?: number;
};

const Container = styled.div<SheetWrapperProps>`
  position: relative;
  margin: 0 auto;
  padding-top: ${(props) => props.paddingTop}rem;

  ${MediaLayout}
`;

function SheetWrapper({ children, paddingTop = 8 }: SheetWrapperProps) {
  return <Container paddingTop={paddingTop}>{children}</Container>;
}

export default SheetWrapper;
