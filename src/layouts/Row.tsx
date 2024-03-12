import React from "react";
import styled from "styled-components";

type RowProps = {
  children: React.ReactNode | React.ReactNode[];
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
};

const Container = styled.div<{
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
}>`
  display: flex;
  align-items: ${(props) => props.alignItems || "normal"};
  justify-content: ${(props) => props.justifyContent || "normal"};
  gap: ${(props) => `${props.gap}px`};
  width: 100%;
  height: 100%;
`;

function Row({ children, alignItems, justifyContent, gap }: RowProps) {
  return (
    <Container
      alignItems={alignItems}
      justifyContent={justifyContent}
      gap={gap}
    >
      {children}
    </Container>
  );
}

export default Row;
