import React from "react";
import styled from "styled-components";

type LineProps = {
  width?: string;
  margin?: string;
  borderWidth?: string;
  borderColor?: string;
};

const Container = styled.hr<LineProps>`
  width: ${(props) => props.width};
  transform-origin: right center;
  margin: ${(props) => props.margin};
  border: ${(props) => props.borderWidth} solid
    ${(props) =>
      props.borderColor ? props.borderColor : props.theme.lightGreyColor};
`;

function Line({
  width = "100%",
  margin = "auto",
  borderColor = "",
  borderWidth = "2px",
}: LineProps) {
  return (
    <Container
      width={width}
      margin={margin}
      borderColor={borderColor}
      borderWidth={borderWidth}
    />
  );
}

export default Line;
