import React from "react";
import styled from "styled-components";
import BGImage from "../../assets/images/demo.jpg";

type HomeSectionBGProps = {
  children: React.ReactNode;
};

const Container = styled.section`
  background-image: url(${BGImage});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
`;

function HomeSectionBG({ children }: HomeSectionBGProps) {
  return <Container>{children}</Container>;
}

export default HomeSectionBG;
