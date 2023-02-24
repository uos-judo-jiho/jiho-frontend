import styled, { css } from "styled-components";
import { ReactComponent as BackArrow } from "../assets/svgs/arrow_back_ios.svg";
import { ReactComponent as ForwardArrow } from "../assets/svgs/arrow_forward_ios.svg";

type ArrowProps = {
  current: number;
  length: number;
  size?: string;
};

const ArrowCss = css`
  position: absolute;
  z-index: 10;
  top: 50%;
  user-select: none;

  cursor: pointer;
`;

const StyledBackArrow = styled(BackArrow)<ArrowProps>`
  display: ${(props) => (props.current === 0 ? "none" : "flex")};
  width: ${(props) => (props.size ? props.size : "20px")};
  height: ${(props) => (props.size ? props.size : "20px")};

  left: 12px;
  ${ArrowCss}
`;

const StyledForwardArrow = styled(ForwardArrow)<ArrowProps>`
  display: ${(props) => (props.current < props.length - 1 ? "flex" : "none")};
  width: ${(props) => (props.size ? props.size : "20px")};
  height: ${(props) => (props.size ? props.size : "20px")};

  right: 0;
  ${ArrowCss}
`;

export { StyledBackArrow, StyledForwardArrow };
