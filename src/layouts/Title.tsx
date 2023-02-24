import React from "react";
import styled from "styled-components";

type TitleProps = {
  title: string;
  color?: string;
};

type ContainerProps = {
  color?: string;
};

const Container = styled.h1`
  font-size: ${(props) => props.theme.titleFontSize};
  color: ${(props) => props.color};
`;

function Title({ title, color }: TitleProps) {
  return <Container color={color}>{title}</Container>;
}

export default Title;
