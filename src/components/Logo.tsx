import React from "react";
import styled from "styled-components";

import LogoWhite from "../assets/images/logo/logo-removebg-white.png";
import LogoBlack from "../assets/images/logo/logo-removebg.png";

type LogoProps = {
  size?: number;
  margin?: string;
};

type ContainerProps = {
  margin: string;
  size: number;
};

const Container = styled.div<ContainerProps>`
  margin: ${(props) => props.margin};
  display: flex;

  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

function Logo({ size = 60, margin = "0px" }: LogoProps) {
  return (
    <Container margin={margin} size={size}>
      <Img src={LogoBlack} />
    </Container>
  );
}

export default Logo;
