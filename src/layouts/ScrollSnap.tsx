import React from "react";
import styled from "styled-components";

type ScrollSnapProps = {
  children: React.ReactNode;
};

const Container = styled.div`
  scroll-behavior: smooth;
  height: 100vh;
  scroll-snap-type: y mandatory;

  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }

  & > * {
    scroll-snap-align: start;
  }
`;

function ScrollSnap({ children }: ScrollSnapProps) {
  return <Container>{children}</Container>;
}

export default ScrollSnap;
