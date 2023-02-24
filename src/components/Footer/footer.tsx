import styled from "styled-components";
import { ReactComponent as InstargramIcon } from "../../assets/svgs/icons8-instargram-500.svg";
import { ReactComponent as YoutubeIcon } from "../../assets/svgs/icons8-youtube-500.svg";
import FooterInfo from "../../assets/jsons/footerData.json";
import Row from "../../layouts/Row";

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
  position: relative;
  margin: 4px 0;
  color: ${(props) => props.theme.textColor};
  font-size: ${(props) => props.theme.tinyFontSize};
`;

function Footer() {
  return (
    <FooterWrapper>
      <Row justifyContent="space-between">
        <Row>
          <DescriptionList>
            <DescriptionItem>{FooterInfo.title.krTitle}</DescriptionItem>
            <DescriptionItem>{FooterInfo.title.enTitle}</DescriptionItem>
            <DescriptionItem>{FooterInfo.title.since}</DescriptionItem>
          </DescriptionList>
          <DescriptionList>
            <DescriptionItem>{FooterInfo.exercise.title}</DescriptionItem>
            <DescriptionItem>{FooterInfo.exercise.time}</DescriptionItem>
            <DescriptionItem>{FooterInfo.exercise.place}</DescriptionItem>
          </DescriptionList>
          <DescriptionList>
            <DescriptionItem>{FooterInfo.connetUs.title}</DescriptionItem>
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
        </Row>
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
      </Row>
    </FooterWrapper>
  );
}

export default Footer;
