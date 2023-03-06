import styled, { css } from "styled-components";
import { ReactComponent as BackArrow } from "../assets/svgs/arrow_back_ios.svg";
import { ReactComponent as ForwardArrow } from "../assets/svgs/arrow_forward_ios.svg";

type ArrowProps = {
  current: number;
  length: number;
  size?: string;
  mobileSize?: string;
  id?: string;

  isBackGround?: boolean;
};

const ArrowCss = css`
  position: absolute;
  z-index: 10;
  top: 50%;
  user-select: none;

  transform: translate(0, -50%);

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const StyledBackArrow = styled(BackArrow)<ArrowProps>`
  display: ${(props) => (props.current === 0 ? "none" : "flex")};
  width: ${(props) => (props.size ? props.size : "2rem")};
  height: ${(props) => (props.size ? props.size : "2rem")};

  left: 1.2rem;
  ${ArrowCss}

  ${(props) =>
    props.isBackGround
      ? css`
          border-radius: 50%;
          padding: 0.5rem;
          background-color: ${(props) => props.theme.lightGreyColor};
        `
      : ``}

  @media (max-width: 539px) {
    width: ${(props) => (props.mobileSize ? props.mobileSize : "2rem")};
    height: ${(props) => (props.mobileSize ? props.mobileSize : "2rem")};
  }
`;

const StyledForwardArrow = styled(ForwardArrow)<ArrowProps>`
  display: ${(props) => (props.current < props.length - 1 ? "flex" : "none")};
  width: ${(props) => (props.size ? props.size : "2rem")};
  height: ${(props) => (props.size ? props.size : "2rem")};

  right: 1.2rem;
  ${ArrowCss}

  ${(props) =>
    props.isBackGround
      ? css`
          border-radius: 50%;
          padding: 0.5rem;
          background-color: ${(props) => props.theme.lightGreyColor};
        `
      : ``}

  @media (max-width: 539px) {
    width: ${(props) => (props.mobileSize ? props.mobileSize : "2rem")};
    height: ${(props) => (props.mobileSize ? props.mobileSize : "2rem")};
  }
`;

export { StyledBackArrow, StyledForwardArrow };
