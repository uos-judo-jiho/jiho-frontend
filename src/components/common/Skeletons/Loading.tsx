import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const ringAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #4c4ce7ff;
    border-radius: 50%;
    animation: ${ringAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #4c4ce7ad #4a4ae06c #5656db14 transparent;
  }
  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

type LoadingProps = {
  deferTime?: number;
  loading?: boolean;
};

const Loading = ({ deferTime = 237, loading = true }: LoadingProps) => {
  const [isVisible, setIsVisible] = useState(loading);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(loading);
    }, deferTime);
    return () => clearTimeout(timer);
  }, [deferTime, loading]);

  if (!isVisible) {
    return null;
  }

  return (
    <Wrapper>
      <Container>
        <div />
        <div />
        <div />
        <div />
      </Container>
    </Wrapper>
  );
};

export default Loading;
