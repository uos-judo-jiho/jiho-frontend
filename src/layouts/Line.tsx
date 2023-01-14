import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 352px;
  height: 8px;
  transform-origin: right center;
  margin: 26px auto 0 0;
  border: 8px solid ${(props) => props.theme.greyColor};
`;

function Line() {
  return <Container />;
}

export default Line;
