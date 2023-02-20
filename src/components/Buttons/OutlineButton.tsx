import React from "react";
import styled from "styled-components";

type OutlineButtonProps = {
  text: string;
};

const Container = styled.button`
  padding: 10px 30px;
  border: 1px solid ${(props) => props.theme.primaryColor};
  &:hover {
    color: ${(props) => props.theme.primaryColor};
  }
`;

function OutlineButton({ text }: OutlineButtonProps) {
  return <Container>{text}</Container>;
}

export default OutlineButton;
