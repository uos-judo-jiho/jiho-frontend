import React from "react";
import styled from "styled-components";

type HomeSectionBGProps = {
  bgImageSrc: string;
  children: React.ReactNode;
  id: string;
  backgroundCover?: boolean;
};

type ContainerProps = {
  bgImageSrc: string;
  backgroundCover?: boolean;
};

const Container = styled.section<ContainerProps>`
  background-image: url(${(props) => props.bgImageSrc});

  background-repeat: no-repeat;
  background-color: ${(props) => props.theme.blackColor};

  background-size: ${(props) => (props.backgroundCover ? "cover" : "contain")};
  background-position: center;
  width: 100vw;
  height: 100vh;

  /* gradient img */
  position: relative;

  &::before {
    content: "";
    background: radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 0) 0%, #121212 90.2%);

    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
`;

const HomeSectionBG = ({ bgImageSrc, children, id, backgroundCover = true }: HomeSectionBGProps) => {
  return (
    <Container bgImageSrc={bgImageSrc} id={id} backgroundCover={backgroundCover}>
      {children}
    </Container>
  );
};

export default HomeSectionBG;
