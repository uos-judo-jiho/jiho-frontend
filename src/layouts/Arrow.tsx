import styled, { css } from "styled-components";
import { ReactComponent as BackArrow } from "../assets/svgs/arrow_back_ios.svg";
import { ReactComponent as ForwardArrow } from "../assets/svgs/arrow_forward_ios.svg";

type ArrowProps = {
  current: number;
  length: number;
  horizontalPosition?: string;
  size?: string;
  mobileSize?: string;
  id?: string;
  isMobileVisible?: boolean;
  isBackGround?: boolean;
  isVisble?: boolean;
};

const ArrowCss = css`
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translate(0, -50%);
  user-select: none;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const StyledBackArrow = styled(BackArrow)<ArrowProps>`
  display: ${(props) => (props.current !== 0 || props.isVisble ? "flex" : "none")} !important;
  width: ${(props) => (props.size ? props.size : "24px")};
  height: ${(props) => (props.size ? props.size : "24px")};

  left: ${(props) => (props.horizontalPosition ? props.horizontalPosition : "1.2rem")};
  ${ArrowCss}

  ${(props) =>
    props.isBackGround
      ? css`
          border-radius: 50%;
          padding: 0.5rem;
          background-color: ${(props) => props.theme.lightGreyColor};
          box-shadow: 0 0 0.2rem ${(props) => props.theme.blackColor};
        `
      : ``}

  @media (max-width: 539px) {
    width: ${(props) => (props.mobileSize ? props.mobileSize : "24px")};
    height: ${(props) => (props.mobileSize ? props.mobileSize : "24px")};
    display: ${(props) => (props.isMobileVisible ? "flex" : "none")};
  }
`;

const StyledForwardArrow = styled(ForwardArrow)<ArrowProps>`
  display: ${(props) => (props.current < props.length - 1 || props.isVisble ? "flex" : "none")} !important;
  width: ${(props) => (props.size ? props.size : "24px")};
  height: ${(props) => (props.size ? props.size : "24px")};

  right: ${(props) => (props.horizontalPosition ? props.horizontalPosition : "1.2rem")};
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
    width: ${(props) => (props.mobileSize ? props.mobileSize : "24px")};
    height: ${(props) => (props.mobileSize ? props.mobileSize : "24px")};
    display: ${(props) => (props.isMobileVisible ? "flex" : "none")};
  }
`;

export { StyledBackArrow, StyledForwardArrow };
