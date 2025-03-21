import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import UpperArrowSvg from "@/lib/assets/svgs/upper-arrow.svg";

const FadeIn = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1.0);
  }
`;
const FadeOut = keyframes`
  from {
    transform: scale(1.0);
  }
  to {
    transform: scale(0);
  }
`;

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;

  background-color: transparent;
`;
const UpperButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${(props) => props.theme.lightGreyColor};
  opacity: 0.8;
`;

const FadeInAnimationWrapper = styled.div`
  transform-origin: center center;

  animation-duration: 0.25s;
  animation-timing-function: ease-in;
  animation-name: ${FadeIn};
  animation-fill-mode: forwards;
`;
const FadeOutAnimationWrapper = styled.div`
  transform-origin: center center;

  animation-duration: 0.25s;
  animation-timing-function: ease-in;
  animation-name: ${FadeOut};
  animation-fill-mode: forwards;
`;

const StyledUpperArrow = styled.img`
  width: inherit;
  height: inherit;
`;

function StickyButton() {
  const [visible, setVisible] = useState<boolean>(false);
  const [isRender, setIsRender] = useState<boolean>(false);

  function toggleVisible() {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
      setIsRender(true);
    } else {
      setVisible(false);
    }
  }
  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);

    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, []);

  return (
    <Container>
      {isRender ? (
        visible ? (
          <FadeInAnimationWrapper>
            <UpperButton onClick={handleClick}>
              <StyledUpperArrow src={UpperArrowSvg} />
            </UpperButton>
          </FadeInAnimationWrapper>
        ) : (
          <FadeOutAnimationWrapper>
            <UpperButton onClick={handleClick}>
              <StyledUpperArrow src={UpperArrowSvg} />
            </UpperButton>
          </FadeOutAnimationWrapper>
        )
      ) : (
        <></>
      )}
    </Container>
  );
}

export default StickyButton;
