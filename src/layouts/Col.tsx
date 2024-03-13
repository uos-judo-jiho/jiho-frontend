import React from "react";
import styled, { css } from "styled-components";

type ColProps = {
  children: React.ReactNode;
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
  full?: boolean;
};

const Container = styled.div<{
  alignItems?: string;
  justifyContent?: string;
  full: boolean;
  gap?: number;
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
  gap: ${(props) => `${props.gap}px`};
`;

function Col({
  children,
  alignItems,
  justifyContent,
  full = false,
  gap,
}: ColProps) {
  return (
    <Container
      alignItems={alignItems}
      justifyContent={justifyContent}
      full={full}
      gap={gap}
    >
      {children}
    </Container>
  );
}

export default Col;
