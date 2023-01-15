import React from "react";
import styled from "styled-components";
import BGImage from "../../assets/images/demo.jpg";

type HomeSectionBGProps = {
  bgImageSrc: string;
  children: React.ReactNode;
  id: string;
};

type ContainerProps = {
  bgImageSrc: string;
};

const Container = styled.section<ContainerProps>`
  background-image: url(${(props) => props.bgImageSrc});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
`;

function HomeSectionBG({ bgImageSrc, children, id }: HomeSectionBGProps) {
  return (
    <Container bgImageSrc={bgImageSrc} id={id}>
      {children}
    </Container>
  );
}

export default HomeSectionBG;
