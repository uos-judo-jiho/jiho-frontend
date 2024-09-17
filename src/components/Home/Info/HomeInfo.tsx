import React from "react";
import styled, { css } from "styled-components";
import Col from "../../../layouts/Col";
import Title from "../../../layouts/Title";
import Logo from "../../Logo";
import FooterInfo from "../../../assets/jsons/footerData.json";

const Container = styled.div`
  margin-bottom: 1rem;

  flex: 1;
`;

const MobileInvisible = css`
  @media (max-width: 539px) {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  border: 0.2rem solid ${(props) => props.theme.textColor};
  border-radius: 50%;
  width: 14rem;
  height: 14rem;
  margin-bottom: 2rem;
  background-color: ${(props) => props.theme.bgColor};

  display: flex;
  justify-content: center;
  align-items: center;

  ${MobileInvisible}
`;

const DescriptionContainer = styled.ul``;
const DescriptionItem = styled.li`
  font-size: ${(props) => props.theme.defaultFontSize};
`;

const DescriptionTitle = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
  margin-bottom: 1.2rem;
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
            <Title title={FooterInfo.title.krTitle} />
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{FooterInfo.title.since}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTitle>{FooterInfo.exercise.title}</DescriptionTitle>
          </DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.time}</DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.place}</DescriptionItem>
        </DescriptionContainer>
      </Col>
    </Container>
  );
}

export default HomeInfo;
