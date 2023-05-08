import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Line from "../../../layouts/Line";

const FadeIn = keyframes`
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
`;

const Container = styled.div`
  width: max-content;

  font-size: ${(props) => props.theme.defaultFontSize};
  color: ${(props) => props.theme.greyColor};
`;

const LinkWrapper = styled.div`
  padding: 0.8rem 1.2rem;
  &:hover {
    background-color: ${(props) => props.theme.lightGreyColor};
    color: ${(props) => props.theme.textColor};
    animation: ${FadeIn} 0.5s;
    animation-timing-function: ease-in-out;
  }
`;

function NoticeFooter() {
  return (
    <>
      <Line borderWidth="1px" margin="2rem 0" />
      <Container>
        <LinkWrapper>
          <Link to="/notice">목록으로</Link>
        </LinkWrapper>
      </Container>
    </>
  );
}

export default NoticeFooter;
