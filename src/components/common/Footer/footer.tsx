import { MobileRowColLayout } from "@/components/layouts/MobileRowColLayout";
import { footerData } from "@/lib/assets/data/footer";
import { Constants } from "@/lib/constant";
import { Link } from "react-router-dom";

import styled from "styled-components";

const DescriptionList = styled.ul`
  margin-right: 20px;
  margin-bottom: 5px;
`;

const DescriptionItem = styled.li`
  margin: 4px 0;
  color: ${(props) => props.theme.textColor};
  font-size: ${(props) => props.theme.tinyFontSize};

  word-break: keep-all;
  word-wrap: break-word;
`;

const DescriptionItemTitle = styled.li`
  margin: 4px 0;

  font-weight: bold;
  font-size: ${(props) => props.theme.tinyFontSize};
  color: ${(props) => props.theme.textColor};
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
    <footer className="sm:mx-auto my-8 py-8 px-4">
      <MobileRowColLayout rowJustifyContent="center">
        {/* MARK: Home 훈련 일지 지호지 */}
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
              <Link
                to={`/news/${Constants.LATEST_NEWS_YEAR}`}
              >{`${Constants.LATEST_NEWS_YEAR} 지호지로 바로가기`}</Link>
            </LinkWrapper>
          </DescriptionItem>
          {/* 관리자 페이지로 */}
          <DescriptionItem>
            <LinkWrapper>
              <Link
                to={"/admin"}
                className="text-gray-500 hover:text-gray-600 hover:underline"
              >
                {`관리자 페이지`}
              </Link>
            </LinkWrapper>
          </DescriptionItem>
        </DescriptionList>
        {/* 지호 이름 */}
        <DescriptionList>
          <DescriptionItemTitle>
            {footerData.title.krTitle}
          </DescriptionItemTitle>
          <DescriptionItem>{footerData.title.enTitle}</DescriptionItem>
          <DescriptionItem>{footerData.title.since}</DescriptionItem>
        </DescriptionList>
        {/* 정규 운동 */}
        <DescriptionList>
          <DescriptionItemTitle>
            {footerData.exercise.title}
          </DescriptionItemTitle>
          <DescriptionItem>{footerData.exercise.time}</DescriptionItem>
          <DescriptionItem>{footerData.exercise.place}</DescriptionItem>
        </DescriptionList>
        {/* Connect Us */}
        <DescriptionList>
          <DescriptionItemTitle>
            {footerData.connetUs.title}
          </DescriptionItemTitle>
          <DescriptionItem>
            {footerData.connetUs.instagram.title}
            <HyperLink
              href="https://www.instagram.com/uos_judo/"
              target="_blank"
            >
              {footerData.connetUs.instagram.href}
            </HyperLink>
          </DescriptionItem>
          <DescriptionItem>
            {footerData.connetUs.email.title}
            <HyperLink href="mailto: uosjudojiho@gmail.com">
              {footerData.connetUs.email.href}
            </HyperLink>
          </DescriptionItem>
          <DescriptionItem>
            {footerData.connetUs.dev.title}
            <HyperLink href="mailto: uosjudojiho@gmail.com">
              {footerData.connetUs.dev.href}
            </HyperLink>
          </DescriptionItem>
        </DescriptionList>
      </MobileRowColLayout>
    </footer>
  );
};

export default Footer;
