import React from "react";
import styled from "styled-components";

type RowProps = {
  children: React.ReactNode | React.ReactNode[];
  alignItems?: string;
  justifyContent?: string;
  gap?: number;
};

const Row = styled.div<Omit<RowProps, "children">>`
  display: flex;
  align-items: ${(props) => props.alignItems || "normal"};
  justify-content: ${(props) => props.justifyContent || "normal"};
  gap: ${(props) => `${props.gap}px`};

  width: 100%;
  height: 100%;
`;

export default Row;
