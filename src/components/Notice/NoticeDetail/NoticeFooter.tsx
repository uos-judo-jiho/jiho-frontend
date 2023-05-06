import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Line from "../../../layouts/Line";
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
