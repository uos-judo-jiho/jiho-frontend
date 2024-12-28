import styled from "styled-components";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import Slider from "../../layouts/Slider";
import { useState } from "react";

type MobilePhotoCardProps = {
  id: string;
  articleInfo: ArticleInfoType;
};

const MobilePhotoCardContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin: 4px 0;

  border-top: 1px solid ${(props) => props.theme.lightGreyColor};
  border-bottom: 1px solid ${(props) => props.theme.lightGreyColor};
`;

const CardHeader = styled.header`
  padding: 14px 16px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    font-size: ${(props) => props.theme.defaultFontSize};
    line-height: ${(props) => props.theme.defaultLineHeight};
    color: ${(props) => props.theme.textColor};
    font-weight: 700;
    letter-spacing: 0.16px;
  }

  .sub-info {
    display: flex;
    gap: 4px;
    span {
      font-size: ${(props) => props.theme.defaultFontSize};
      line-height: ${(props) => props.theme.defaultLineHeight};
      color: ${(props) => props.theme.textColor};
      letter-spacing: 0.16px;

      & .datetime {
        color: ${(props) => props.theme.greyColor};
      }
    }
  }
`;

const SliderContainer = styled.div`
  flex-grow: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 14px 16px;
  color: ${(props) => props.theme.textColor};

  & .participants {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    font-size: ${(props) => props.theme.defaultFontSize};
    line-height: ${(props) => props.theme.defaultLineHeight};
    letter-spacing: 0.14px;
  }

  & .description {
    font-size: ${(props) => props.theme.defaultFontSize};
    line-height: ${(props) => props.theme.defaultLineHeight};
    letter-spacing: 0.16px;

    word-wrap: break-word;
    white-space: pre-wrap;
  }
`;

const MoreButton = styled.button`
  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: ${(props) => props.theme.defaultLineHeight};
  color: ${(props) => props.theme.greyColor};
  letter-spacing: 0.16px;

  cursor: pointer;
`;

const MobilePhotoCard = ({ articleInfo, id }: MobilePhotoCardProps) => {
  const [isMore, setIsMore] = useState(false);
  return (
    <MobilePhotoCardContainer id={id}>
      <CardHeader>
        <h3>{articleInfo.title}</h3>
        <div className="sub-info">
          <span>{articleInfo.author}</span>
          <span className="datetime">{articleInfo.dateTime}</span>
        </div>
      </CardHeader>
      <SliderContainer>
        <Slider datas={articleInfo.imgSrcs} />
      </SliderContainer>
      <Content>
        <div className="participants">
          {articleInfo.tags.map((tag) => (
            <span key={tag}>{`#${tag}`}</span>
          ))}
        </div>
        <p className="description">
          {isMore ? articleInfo.description : articleInfo.description.slice(0, 20)}
          {!isMore && <MoreButton onClick={() => setIsMore(true)}>...더보기</MoreButton>}
        </p>
      </Content>
    </MobilePhotoCardContainer>
  );
};

export default MobilePhotoCard;
