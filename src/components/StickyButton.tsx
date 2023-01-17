import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as UpperArrow } from "../assets/svgs/upper-arrow.svg";
const Container = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: transparent;
`;
const UpperButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${(props) => props.theme.greyColor};
  opacity: 0.8;
`;

const StyledUpperArrow = styled(UpperArrow)`
  width: inherit;
  height: inherit;
`;

function StickyButton() {
  const [visible, setVisible] = useState(false);

  function toggleVisible() {
    const scrolled = document.documentElement.scrollTop;
    scrolled > 300 ? setVisible(true) : setVisible(false);
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
      {visible ? (
        <UpperButton onClick={handleClick}>
          <StyledUpperArrow />
        </UpperButton>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default StickyButton;
