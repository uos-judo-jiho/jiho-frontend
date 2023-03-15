import React from "react";

import styled, { keyframes } from "styled-components";

type SkeletonItemProps = {
  children?: React.ReactNode;
};

const LoadingAnimation = keyframes`
    0% {
      transform: translateX(0);
    }
    50%,
    100% {
      transform: translateX(460px);
    }
  `;

const SkeletonItemStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.lightGreyColor};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, #f2f2f2, #ddd, #f2f2f2);
    animation: ${LoadingAnimation} 2s infinite linear;
  }
`;

function SkeletonItem({ children }: SkeletonItemProps) {
  return <SkeletonItemStyle>{children}</SkeletonItemStyle>;
}

export default SkeletonItem;
