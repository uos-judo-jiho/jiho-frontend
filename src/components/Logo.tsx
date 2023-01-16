import React from "react";
import styled from "styled-components";

import { ReactComponent as LogoSvg } from "../assets/svgs/logo.svg";

type LogoProps = {
  width?: number;
  height?: number;
  margin?: number;
};

type ContainerProps = {
  margin?: number;
};
const Container = styled.div<ContainerProps>`
  margin: ${(props) => props.margin}px;
`;

const StyledLogo = styled(LogoSvg)`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

function Logo({ width = 120, height = 120, margin = 0 }: LogoProps) {
  return (
    <Container margin={margin}>
      <StyledLogo width={width} height={height} />
    </Container>
  );
}

export default Logo;
