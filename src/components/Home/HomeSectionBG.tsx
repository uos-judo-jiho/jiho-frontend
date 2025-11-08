import React from "react";
import styled from "styled-components";

type HomeSectionBGProps = {
  bgImageSrc: string;
  bgImageSrcWebp: string;
  bgImageAlt: string;
  children: React.ReactNode;
  id: string;
  backgroundCover?: boolean;
};

const Container = styled.section`
  position: relative;

  width: 100vw;
  height: 100vh;
`;

const BackgroundImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: ${(props) => props.theme.blackColor};

  &::before {
    content: "";
    background: radial-gradient(
      circle at 40% 20%,
      rgba(0, 0, 0, 0) 0%,
      rgb(18, 18, 18) 90.2%
    );

    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
`;
const Picture = styled.picture`
  border: none;
  outline: none;
`;

const BackgroundImage = styled.img<{ backgroundCover: boolean }>`
  width: 100%;
  height: 100%;

  object-fit: ${(props) => (props.backgroundCover ? "cover" : "contain")};
`;

const HomeSectionBG = ({
  bgImageSrc,
  bgImageSrcWebp,
  bgImageAlt,
  children,
  id,
  backgroundCover = true,
}: HomeSectionBGProps) => {
  return (
    <Container id={id}>
      <BackgroundImageWrapper>
        <Picture>
          <source srcSet={bgImageSrcWebp} type="image/webp" />
          <source srcSet={bgImageSrc} type="image/jpeg" />
          <BackgroundImage
            src={bgImageSrc}
            alt={bgImageAlt}
            backgroundCover={backgroundCover}
          />
        </Picture>
      </BackgroundImageWrapper>
      {children}
    </Container>
  );
};

export default HomeSectionBG;
