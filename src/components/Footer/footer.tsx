import styled from "styled-components";
import FooterInfo from "../../assets/jsons/footerData.json";
import { ReactComponent as InstargramIcon } from "../../assets/svgs/icons8-instargram-500.svg";
import { ReactComponent as YoutubeIcon } from "../../assets/svgs/icons8-youtube-500.svg";
import Row from "../../layouts/Row";
import MobileRowColLayout from "../../layouts/MobileRowColLayout";

const FooterWrapper = styled.footer`
  margin: 40px auto;
`;

const SNSLink = styled.a``;

const IconWrapper = styled.span`
  width: 54px;
  height: 54px;
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

function Footer() {
  return (
    <FooterWrapper>
      <MobileRowColLayout rowJustifyContent="start">
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
          {/* TODO 연락처 추가하면 주석 해제 */}
          {/* <DescriptionItem>
              {FooterInfo.connetUs.tel.title}
              <a href="tel: 010-2222-3333">{FooterInfo.connetUs.tel.href}</a>
            </DescriptionItem> */}
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
