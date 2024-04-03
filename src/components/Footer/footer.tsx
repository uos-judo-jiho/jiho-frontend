/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO:
import { Link } from "react-router-dom";
import styled from "styled-components";
import FooterInfo from "../../assets/jsons/footerData.json";
import MobileRowColLayout from "../../layouts/MobileRowColLayout";

const FooterWrapper = styled.footer`
  margin: 80px auto 40px auto;

  @media (max-width: 539px) {
    margin: 80px auto 20px auto;
  }
`;

const DescriptionList = styled.ul`
  margin-right: 20px;
  margin-bottom: 5px;
`;

const DescriptionItem = styled.li`
  margin: 4px 0;
  color: ${(props) => props.theme.textColor};
  font-size: ${(props) => props.theme.tinyFontSize};
`;

const DescriptionItemTitle = styled.li`
  margin: 4px 0;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
  font-size: ${(props) => props.theme.tinyFontSize};
`;

const LinkWrapper = styled.div`
  &:hover {
    opacity: 0.6;
  }
`;

const HyperLink = styled.a`
  &:hover {
    opacity: 0.6;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <MobileRowColLayout rowJustifyContent="start">
        {/* Home 훈련 일지 지호지 */}
        <DescriptionList>
          <DescriptionItemTitle>
            <LinkWrapper>
              <Link to={"/"}>HOME으로 바로가기</Link>
            </LinkWrapper>
          </DescriptionItemTitle>
          <DescriptionItem>
            <LinkWrapper>
              <Link to={"/photo"}>훈련 일지로 바로가기</Link>
            </LinkWrapper>
          </DescriptionItem>
          <DescriptionItem>
            <LinkWrapper>
              <Link to={"/news/2023"}>2023 지호지로 바로가기</Link>
            </LinkWrapper>
          </DescriptionItem>
          {/* 관리자 페이지로 */}
          <DescriptionItem>
            <LinkWrapper>
              <Link to={"/admin"}>관리자 페이지로</Link>
            </LinkWrapper>
          </DescriptionItem>
        </DescriptionList>
        {/* 지호 이름 */}
        <DescriptionList>
          <DescriptionItemTitle>{FooterInfo.title.krTitle}</DescriptionItemTitle>
          <DescriptionItem>{FooterInfo.title.enTitle}</DescriptionItem>
          <DescriptionItem>{FooterInfo.title.since}</DescriptionItem>
        </DescriptionList>
        {/* 정규 운동 */}
        <DescriptionList>
          <DescriptionItemTitle>{FooterInfo.exercise.title}</DescriptionItemTitle>
          <DescriptionItem>{FooterInfo.exercise.time}</DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.place}</DescriptionItem>
        </DescriptionList>
        {/* Connect Us */}
        <DescriptionList>
          <DescriptionItemTitle>{FooterInfo.connetUs.title}</DescriptionItemTitle>
          <DescriptionItem>
            {FooterInfo.connetUs.instagram.title}
            <HyperLink href="https://www.instagram.com/uos_judo/" target="_blank">
              {FooterInfo.connetUs.instagram.href}
            </HyperLink>
          </DescriptionItem>
          <DescriptionItem>
            {FooterInfo.connetUs.email.title}
            <HyperLink href="mailto: uosjudojiho@gmail.com">{FooterInfo.connetUs.email.href}</HyperLink>
          </DescriptionItem>
          {/* TODO 연락처 추가하면 주석 해제 */}
          {/* <DescriptionItem>
              {FooterInfo.connetUs.tel.title}
              <a href="tel: 010-2222-3333">{FooterInfo.connetUs.tel.href}</a>
            </DescriptionItem> */}
          <DescriptionItem>
            {FooterInfo.connetUs.dev.title}
            <HyperLink href="mailto: min390@uos.ac.kr">{FooterInfo.connetUs.dev.href}</HyperLink>
          </DescriptionItem>
        </DescriptionList>
      </MobileRowColLayout>
    </FooterWrapper>
  );
};

export default Footer;
