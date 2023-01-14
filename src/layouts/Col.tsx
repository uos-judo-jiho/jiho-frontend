import React from "react";
import styled from "styled-components";

type ColProps = {
  children: React.ReactNode;
  alignItems?: string;
  justifyContent?: string;
};

const Container = styled.div<{ alignItems?: string; justifyContent?: string }>`
  display: flex;
  flex-direction: column;

  align-items: ${(props) => props.alignItems || "normal"};
  justify-content: ${(props) => props.justifyContent || "normal"};
`;

function Col({ children, alignItems, justifyContent }: ColProps) {
  return (
    <Container alignItems={alignItems} justifyContent={justifyContent}>
      {children}
    </Container>
  );
}

export default Col;
