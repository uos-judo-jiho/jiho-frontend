import React from "react";
import styled from "styled-components";

type TitleProps = {
  title: string;
};

const Container = styled.h1`
  font-size: ${(props) => props.theme.titleFontSize};
`;

function Title({ title }: TitleProps) {
  return <Container>{title}</Container>;
}

export default Title;
