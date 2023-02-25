import React from "react";
import styled from "styled-components";
import Col from "../../../layouts/Col";
import Title from "../../../layouts/Title";
import Logo from "../../Logo";
import FooterInfo from "../../../assets/jsons/footerData.json";

const Container = styled.div`
  line-height: normal;
  margin-bottom: 1rem;
`;

const LogoWrapper = styled.div`
  border: 2px solid ${(props) => props.theme.textColor};
  border-radius: 50%;
  width: 140px;
  height: 140px;
  margin-bottom: 2rem;
  background-color: ${(props) => props.theme.bgColor};

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 539px) {
    display: none;
  }
`;

const DescriptionContainer = styled.ul``;
const DescriptionItem = styled.li``;

const DescriptionTitle = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
  margin-bottom: 12px;
`;

function HomeInfo() {
  return (
    <Container>
      <Col>
        <LogoWrapper>
          <Logo size={"100px"} isDark={true} />
        </LogoWrapper>
        <DescriptionContainer>
          <DescriptionItem>
            <Title title={FooterInfo.title.krTitle}></Title>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{FooterInfo.title.since}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{FooterInfo.exercise.title}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.time}</DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.place}</DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{FooterInfo.connetUs.title}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>
            {FooterInfo.connetUs.instagram.title}
            <a href="https://www.instagram.com/uos_judo/" target="_blank">
              {FooterInfo.connetUs.instagram.href}
            </a>
          </DescriptionItem>
          <DescriptionItem>
            {FooterInfo.connetUs.email.title}
            <a href="mailto: uosjudojiho@gmail.com">
              {FooterInfo.connetUs.email.href}
            </a>
          </DescriptionItem>
          {/* <DescriptionItem>
            {FooterInfo.connetUs.tel.title}
            <a href="tel: 010-2222-3333">{FooterInfo.connetUs.tel.href}</a>
          </DescriptionItem> */}
        </DescriptionContainer>
      </Col>
    </Container>
  );
}

export default HomeInfo;
