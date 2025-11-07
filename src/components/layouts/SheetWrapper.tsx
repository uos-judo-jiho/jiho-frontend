import React from "react";
import styled from "styled-components";
import { MediaLayout } from "@/lib/theme/GlobalStyle";

type SheetWrapperProps = {
  children: React.ReactNode;
  className?: string;
  paddingTop?: number;
};

const Container = styled.div<SheetWrapperProps>`
  position: relative;
  margin: 0 auto;
  padding-top: ${(props) => props.paddingTop || 92}px;

  ${MediaLayout}
`;

function SheetWrapper({ children, paddingTop, className }: SheetWrapperProps) {
  return (
    <Container paddingTop={paddingTop} className={className}>
      {children}
    </Container>
  );
}

export default SheetWrapper;
