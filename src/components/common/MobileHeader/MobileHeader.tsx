import styled from "styled-components";
import { ArrowBackIosIcon } from "@/components/icons";

// TODO: 모바일 헤더 높이 44px 고정 상수화

const MobileHeaderContainer = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: 16px;

  height: 44px;
  padding: 0 16px;

  border-bottom: 1px solid ${(props) => props.theme.lightGreyColor};

  background-color: rgb(255, 255, 255);

  & .nav-icon {
    width: 24px;
    height: 24px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  text-align: center;
  & .title {
    font-size: ${(props) => props.theme.tinyFontSize};
    line-height: ${(props) => props.theme.tinyLineHeight};
    color: ${(props) => props.theme.greyColor};
    letter-spacing: 0.32px;
  }

  & .sub-title {
    font-size: ${(props) => props.theme.defaultFontSize};
    line-height: ${(props) => props.theme.defaultLineHeight};
    color: ${(props) => props.theme.textColor};
    letter-spacing: 0.16px;
  }
`;

interface MobileHeaderProps {
  backUrl: string;
  subTitle: string;
  subTitleUrl: string;
}

const MobileHeader = ({
  backUrl,
  subTitle,
  subTitleUrl,
}: MobileHeaderProps) => {
  return (
    <MobileHeaderContainer>
      <div className="nav-icon">
        <a href={backUrl}>
          <ArrowBackIosIcon title="Go back" />
        </a>
      </div>
      <HeaderContainer>
        <a href="/">
          <h1 className="title">{"서울시립대학교 유도부 지호"}</h1>
        </a>
        <a href={subTitleUrl}>
          <h2 className="sub-title">{subTitle}</h2>
        </a>
      </HeaderContainer>
      <div className="nav-icon" />
    </MobileHeaderContainer>
  );
};

export default MobileHeader;
