import styled from "styled-components";
import { ReactComponent as InstargramIcon } from "../../assets/svgs/icons8-instargram-500.svg";
import { ReactComponent as YoutubeIcon } from "../../assets/svgs/icons8-youtube-500.svg";
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
  margin-right: 20px;
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
            <DescriptionItem>
              서울시립대학교 유도 동아리 지호 志豪
            </DescriptionItem>
            <DescriptionItem>
              University of Seoul Judo Team 志豪
            </DescriptionItem>
            <DescriptionItem>Since 1985</DescriptionItem>
          </DescriptionList>
          <DescriptionList>
            <DescriptionItem>정규 운동</DescriptionItem>
            <DescriptionItem>
              시간 : 매주 월, 수, 금 18:00-20:00{" "}
            </DescriptionItem>
            <DescriptionItem>
              장소 : 서울시립대 건설공학관 지하 1층
            </DescriptionItem>
          </DescriptionList>
        </Row>
        <Row alignItems="center" justifyContent="center">
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
        </Row>
      </Row>
    </FooterWrapper>
  );
}

export default Footer;
