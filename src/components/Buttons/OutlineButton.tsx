import React from "react";
import styled from "styled-components";

type OutlineButtonProps = {
  text?: string;
  backgroundColor?: string;
};

const Container = styled.button<OutlineButtonProps>`
  padding: 0.5rem 1.5rem;
  border: 1px solid ${(props) => props.theme.primaryColor};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : props.theme.greyColor};

  &:hover {
    color: ${(props) => props.theme.primaryColor};
  }
`;

function OutlineButton({
  text = "outlineButton",
  backgroundColor,
}: OutlineButtonProps) {
  return <Container backgroundColor={backgroundColor}>{text}</Container>;
}

export default OutlineButton;
