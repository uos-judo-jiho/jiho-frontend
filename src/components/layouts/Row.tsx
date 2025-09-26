import React from "react";
import styled, { css } from "styled-components";
import { PickCSSProperty } from "@/lib/utils/Type";

type RowProps = {
  children: React.ReactNode | React.ReactNode[];
} & PickCSSProperty<"alignItems" | "justifyContent" | "gap">;

const Row = styled.div<
  Omit<RowProps, "children"> & { $mobile?: boolean; $pc?: boolean }
>`
  align-items: ${(props) => props.alignItems || "normal"};
  justify-content: ${(props) => props.justifyContent || "normal"};
  gap: ${(props) => `${props.gap}px`};

  display: flex;
  width: 100%;
  height: 100%;

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

export default Row;
