import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import RightArrow from "@/lib/assets/svgs/arrow_back_ios.svg";
import MobilePhotoCard from "@/components/Photo/MobilePhotoCard";
import Loading from "@/components/common/Skeletons/Loading";
import { useNews } from "@/recoils/news";
import { NewsParamsType } from "@/lib/types/NewsParamsType";

// TODO: 모바일 헤더 높이 44px 고정 상수화

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

  const { id, index } = useParams<NewsParamsType>();

  useEffect(() => {
    if (news.some((newsData) => newsData.year.toString() === id?.toString())) {
      return;
    }
    fetch(id);
  }, [fetch, id, news]);

  useEffect(() => {
    if (!index || !news) {
      return;
    }
    document.getElementById(`news-mobile-card-${index}`)?.scrollIntoView();
  }, [index, news]);

  if (!news) {
    return <Loading />;
  }

  return (
    <div>
      <MobileHeader>
        <div className="nav-icon">
          <a href={`/news/${id}`}>
            <img src={RightArrow} alt="right" />
          </a>
        </div>
        <HeaderContainer>
          <a href="/">
            <h1 className="title">{"서울시립대학교 유도부 지호"}</h1>
          </a>
          <a href={`/news/${id}`}>
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
