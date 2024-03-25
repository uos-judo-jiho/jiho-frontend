import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import useBodyScrollLock from "../../Hooks/useBodyScrollLock";
import { ReactComponent as RightArrow } from "../../assets/svgs/arrow_back_ios.svg";
import MobilePhotoCard from "../../components/Photo/MobilePhotoCard";
import Loading from "../../components/Skeletons/Loading";
import { useNews } from "../../recoills/news";

const MobileHeader = styled.header`
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

const Feed = styled.div`
  & > div:first-child {
    margin-top: 0;
  }
`;

const NewsMobile = () => {
  const { news, fetch } = useNews();

  const { openScroll } = useBodyScrollLock();
  const location = useLocation();
  const id = location.pathname.replace("photo", "").split("/").at(-1) ?? "";

  useEffect(() => {
    fetch();
    openScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openScroll]);

  useEffect(() => {
    if (!id || !news) {
      return;
    }
    document.getElementById(`news-mobile-card-${id}`)?.scrollIntoView();
  }, [id, news]);

  if (!news) {
    return <Loading />;
  }
  return (
    <div>
      <MobileHeader>
        <div className="nav-icon">
          <a href="/news/2022">
            <RightArrow />
          </a>
        </div>
        <HeaderContainer>
          <a href="/">
            <h1 className="title">{"서울시립대학교 유도부 지호"}</h1>
          </a>
          <a href="/news/2022">
            <h2 className="sub-title">{"지호지"}</h2>
          </a>
        </HeaderContainer>
        <div className="nav-icon" />
      </MobileHeader>
      <Feed>
        {news.map((newsByYear) =>
          newsByYear.articles.map((newsInfo) => (
            <MobilePhotoCard
              key={newsInfo.id}
              articleInfo={newsInfo}
              id={`news-mobile-card-${newsInfo.id}`}
            />
          ))
        )}
      </Feed>
    </div>
  );
};

export default NewsMobile;
