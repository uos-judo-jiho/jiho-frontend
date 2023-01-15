import React from "react";
import styled from "styled-components";
import SheetWrapper from "../../layouts/SheetWrapper";
import { ReactComponent as InstargramIcon } from "../../assets/svgs/icons8-instargram-500.svg";
import { ReactComponent as YoutubeIcon } from "../../assets/svgs/icons8-youtube-500.svg";
import Row from "../../layouts/Row";

const FooterWrapper = styled.footer`
  margin: 0 auto;
`;

const Container = styled.div`
  height: 64px;
  min-height: 16px;
  width: 158px;
  min-width: 94px;
  white-space: nowrap;
  margin: 44px auto;
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

const DescriptionList = styled.ul``;
const DescriptionItem = styled.li``;

function footer() {
  return (
    <FooterWrapper>
      <Container>
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
      </Container>
      <DescriptionList>
        <DescriptionItem>서울시립대학교 유도 동아리 지호 志豪</DescriptionItem>
        <DescriptionItem>University of Seoul Judo Team 志豪</DescriptionItem>
        <DescriptionItem>Since 1985</DescriptionItem>
      </DescriptionList>
    </FooterWrapper>
  );
}

export default footer;
