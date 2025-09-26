import React from "react";
import styled, { css } from "styled-components";

type ColProps = {
  children: React.ReactNode;
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
  full?: boolean;
  mobile?: boolean;
  pc?: boolean;
};

function Col({
  children,
  alignItems,
  justifyContent,
  full = false,
  gap,
  mobile,
  pc,
}: ColProps) {
  return (
    <Container
      alignItems={alignItems}
      justifyContent={justifyContent}
      full={full}
      gap={gap}
      $mobile={mobile}
      $pc={pc}
    >
      {children}
    </Container>
  );
}

export default Col;

const Container = styled.div<{
  alignItems?: string;
  justifyContent?: string;
  full: boolean;
  gap?: number;
  $mobile?: boolean;
  $pc?: boolean;
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

  ${({ $mobile }) =>
    $mobile &&
    css`
      @media (min-width: 540px) {
        display: none;
      }
      @media (max-width: 540px) {
        display: flex;
      }
    `}

  ${({ $pc }) =>
    $pc &&
    css`
      @media (max-width: 540px) {
        display: none;
      }
      @media (min-width: 540px) {
        display: flex;
      }
    `}
`;
