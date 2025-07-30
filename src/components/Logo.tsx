import styled from "styled-components";

import LogoWhite from "@/lib/assets/images/logo/logo-removebg-white.png";
import LogoBlack from "@/lib/assets/images/logo/logo-removebg.png";

type LogoProps = {
  size?: string;
  margin?: string;
  isDark?: boolean;
};

type ContainerProps = {
  margin: string;
  size: string;
};

const Container = styled.div<ContainerProps>`
  margin: ${(props) => props.margin};
  display: flex;

  width: ${(props) => props.size};
  height: ${(props) => props.size};
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

const Logo = ({ size = "6rem", margin = "0rem", isDark = false }: LogoProps) => {
  return (
    <Container margin={margin} size={size}>
      <Img src={isDark ? LogoBlack : LogoWhite} />
    </Container>
  );
};

export default Logo;
