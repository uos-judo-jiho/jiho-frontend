import styled, { css } from "styled-components";
import { ReactComponent as BackArrow } from "../assets/svgs/arrow_back_ios.svg";
import { ReactComponent as ForwardArrow } from "../assets/svgs/arrow_forward_ios.svg";

type ArrowProps = {
  current: number;
  length: number;
};

const ArrowCss = css`
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 10;
  user-select: none;

  cursor: pointer;
`;

const StyledBackArrow = styled(BackArrow)<ArrowProps>`
  display: ${(props) => (props.current === 0 ? "none" : "flex")};
  top: 50%;
  left: 12px;
  ${ArrowCss}
`;

const StyledForwardArrow = styled(ForwardArrow)<ArrowProps>`
  display: ${(props) => (props.current < props.length - 1 ? "flex" : "none")};
  top: 50%;
  right: 12px;
  ${ArrowCss}
`;

export { StyledBackArrow, StyledForwardArrow };
