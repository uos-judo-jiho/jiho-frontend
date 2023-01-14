import React from "react";
import styled from "styled-components";

type RowProps = {
  children: React.ReactNode | React.ReactNode[];
  alignItems?: string;
  justifyContent?: string;
};

const Container = styled.div<{ alignItems?: string; justifyContent?: string }>`
  display: flex;
  align-items: ${(props) => props.alignItems || "normal"};
  justify-content: ${(props) => props.justifyContent || "normal"};
`;

function Row({ children, alignItems, justifyContent }: RowProps) {
  return (
    <Container alignItems={alignItems} justifyContent={justifyContent}>
      {children}
    </Container>
  );
}

export default Row;
