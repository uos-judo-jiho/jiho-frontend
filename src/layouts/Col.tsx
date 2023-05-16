import React from "react";
import styled, { css } from "styled-components";

type ColProps = {
  children: React.ReactNode;
  alignItems?: string;
  justifyContent?: string;
  full?: boolean;
};

const Container = styled.div<{
  alignItems?: string;
  justifyContent?: string;
  full: boolean;
}>`
  ${(props) =>
    props.full
      ? css`
          height: 100%;
          width: 100%;
        `
      : ""}
  display: flex;
  flex-direction: column;

  align-items: ${(props) => props.alignItems || "normal"};
  justify-content: ${(props) => props.justifyContent || "normal"};
`;

function Col({ children, alignItems, justifyContent, full = false }: ColProps) {
  return (
    <Container
      alignItems={alignItems}
      justifyContent={justifyContent}
      full={full}
    >
      {children}
    </Container>
  );
}

export default Col;
