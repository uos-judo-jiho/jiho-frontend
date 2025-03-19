import React from "react";
import styled from "styled-components";
import { PickCSSProperty } from "@/lib/utils/Type";

type RowProps = {
  children: React.ReactNode | React.ReactNode[];
} & PickCSSProperty<"alignItems" | "justifyContent" | "gap">;

const Row = styled.div<Omit<RowProps, "children">>`
  display: flex;
  align-items: ${(props) => props.alignItems || "normal"};
  justify-content: ${(props) => props.justifyContent || "normal"};
  gap: ${(props) => `${props.gap}px`};

  width: 100%;
  height: 100%;
`;

export default Row;
