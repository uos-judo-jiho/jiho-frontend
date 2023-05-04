import { Link } from "react-router-dom";
import styled from "styled-components";
import FooterInfo from "../../assets/jsons/footerData.json";
import { ReactComponent as InstargramIcon } from "../../assets/svgs/icons8-instargram-500.svg";
import { ReactComponent as YoutubeIcon } from "../../assets/svgs/icons8-youtube-500.svg";
import MobileRowColLayout from "../../layouts/MobileRowColLayout";

const FooterWrapper = styled.footer`
  margin: 4rem auto;

  @media (max-width: 539px) {
    margin: 1rem auto;
  }
`;

const SNSLink = styled.a``;

const IconWrapper = styled.span`
  width: 5.4rem;
  height: 5.4rem;
`;

const StyledInstargramIcon = styled(InstargramIcon)`
  width: inherit;
  height: inherit;
`;

const StyledYoutubeIcon = styled(YoutubeIcon)`
  width: inherit;
  height: inherit;
`;

const DescriptionList = styled.ul`
  margin-right: 2rem;
  margin-bottom: 0.5rem;
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

function Footer() {
  return (
    <FooterWrapper>
      <MobileRowColLayout rowJustifyContent="start">
        <DescriptionList>
          <DescriptionItemTitle>
            <LinkWrapper>
              <Link to={"/"}>HOME</Link>
            </LinkWrapper>
          </DescriptionItemTitle>
          <DescriptionItem>
            <LinkWrapper>
              <Link to={"/photo"}>훈련 일지</Link>
            </LinkWrapper>
          </DescriptionItem>
          <DescriptionItem>
            <LinkWrapper>
              <Link to={"/news/2022"}>2022 지호지</Link>
            </LinkWrapper>
          </DescriptionItem>
        </DescriptionList>
        <DescriptionList>
          <DescriptionItemTitle>
            {FooterInfo.title.krTitle}
          </DescriptionItemTitle>
          <DescriptionItem>{FooterInfo.title.enTitle}</DescriptionItem>
          <DescriptionItem>{FooterInfo.title.since}</DescriptionItem>
        </DescriptionList>
        <DescriptionList>
          <DescriptionItemTitle>
            {FooterInfo.exercise.title}
          </DescriptionItemTitle>
          <DescriptionItem>{FooterInfo.exercise.time}</DescriptionItem>
          <DescriptionItem>{FooterInfo.exercise.place}</DescriptionItem>
        </DescriptionList>
        <DescriptionList>
          <DescriptionItemTitle>
            {FooterInfo.connetUs.title}
          </DescriptionItemTitle>
          <DescriptionItem>
            {FooterInfo.connetUs.instagram.title}
            <HyperLink
              href="https://www.instagram.com/uos_judo/"
              target="_blank"
            >
              {FooterInfo.connetUs.instagram.href}
            </HyperLink>
          </DescriptionItem>
          <DescriptionItem>
            {FooterInfo.connetUs.email.title}
            <HyperLink href="mailto: uosjudojiho@gmail.com">
              {FooterInfo.connetUs.email.href}
            </HyperLink>
          </DescriptionItem>
          {/* TODO 연락처 추가하면 주석 해제 */}
          {/* <DescriptionItem>
              {FooterInfo.connetUs.tel.title}
              <a href="tel: 010-2222-3333">{FooterInfo.connetUs.tel.href}</a>
            </DescriptionItem> */}
          <DescriptionItem>
            {FooterInfo.connetUs.dev.title}
            <HyperLink href="mailto: min390@uos.ac.kr">
              {FooterInfo.connetUs.dev.href}
            </HyperLink>
          </DescriptionItem>
        </DescriptionList>
        <DescriptionList
          style={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <LinkWrapper>
            <Link to={"/admin"}>
              <DescriptionItem>관리자 페이지로 ▶️</DescriptionItem>
            </Link>
          </LinkWrapper>
        </DescriptionList>

        {/* <Row alignItems="center" justifyContent="center">
          <SNSLink href="https://www.instagram.com/uos_judo/" target="_blank">
            <IconWrapper>
              <StyledInstargramIcon />
            </IconWrapper>
          </SNSLink>
          <SNSLink href="https://www.youtube.com/" target="_blank">
            <IconWrapper>
              <StyledYoutubeIcon />
            </IconWrapper>
          </SNSLink>
        </Row> */}
      </MobileRowColLayout>
    </FooterWrapper>
  );
}

export default Footer;
