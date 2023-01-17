import React from "react";
import HomeSectionBG from "../HomeSectionBG";
import BGImage from "../../../assets/images/demo1.jpg";
import Col from "../../../layouts/Col";
import Logo from "../../Logo";
import styled from "styled-components";
import SheetWrapper from "../../../layouts/SheetWrapper";

const LogoWrapper = styled.div`
  border: 2px solid ${(props) => props.theme.textColor};
  border-radius: 50%;
  width: 140px;
  height: 140px;
  background-color: ${(props) => props.theme.bgColor};
`;

const DescriptionContainer = styled.ul``;
const DescriptionItem = styled.li``;

function HomeSectionInfo() {
  return (
    <>
      <HomeSectionBG bgImageSrc={BGImage} id="sectionInfo">
        <SheetWrapper>
          <Col>
            <LogoWrapper>
              <Logo margin={30} />
            </LogoWrapper>
          </Col>
          <DescriptionContainer>
            <DescriptionItem>
              서울시립대학교 유도 동아리 지호 志豪
            </DescriptionItem>
            <DescriptionItem>SINCE 1985</DescriptionItem>
            <DescriptionItem>정규운동</DescriptionItem>
            <DescriptionItem>
              시간 | 매주 월, 수, 금 18:00-20:00
            </DescriptionItem>
            <DescriptionItem>
              장소 | 서울시립대 건설공학관 지하 1층 02504 Seoul, Korea 동대문구
              서울시립대로 163
            </DescriptionItem>
            <DescriptionItem>Connect Us</DescriptionItem>
            <DescriptionItem>
              인스타그램 |
              <a href="https://www.instagram.com/uos_judo/"> @uos_judo</a>
            </DescriptionItem>
            <DescriptionItem>
              이메일 |
              <a href="mailto: uosjudojiho@gmail.com"> uosjudojiho@gmail.com</a>
            </DescriptionItem>
            <DescriptionItem>
              연락처 | <a href="tel: 010-2222-3333">010-2222-3333</a>
            </DescriptionItem>
          </DescriptionContainer>
        </SheetWrapper>
      </HomeSectionBG>
    </>
  );
}

export default HomeSectionInfo;
