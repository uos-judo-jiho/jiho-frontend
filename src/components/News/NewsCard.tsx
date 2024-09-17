import { useState } from "react";
import styled from "styled-components";

import { Constants } from "../../constant/constant";
import Col from "../../layouts/Col";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import SkeletonThumbnail from "../Skeletons/SkeletonThumbnail";

type NewsCardProps = {
  index: number;
  year: string;
  datas: ArticleInfoType[];
  selectedIndex?: number;
  handleClickCard: (index: string) => void;
};

const Container = styled.div`
  width: 100%;
  max-height: 320px;
  font-size: ${(props) => props.theme.descriptionFontSize};
  line-height: ${(props) => props.theme.descriptionLineHeight};

  display: flex;

  border: 1px solid ${(props) => props.theme.lightGreyColor};
  border-radius: 10px;
  padding: 16px;

  transition: all 500ms;
  cursor: pointer;

  @media (min-width: 540px) {
    &:hover {
      transform: scale3d(1.01, 1.01, 1.01);
      box-shadow: 0.2rem 0.4rem 1.6rem rgb(0 0 0 / 16%);
    }
  }
  @media (max-width: 540px) {
    padding: 8px;
  }
`;

const AnchoreContainer = styled.a`
  width: 100%;
  display: flex;
  gap: 24px;
`;

const ImgWrapper = styled.div`
  flex: 1 1 0;
  width: 50%;

  border-radius: 5px;

  @media (max-width: 539px) {
    width: 100%;
  }
`;

const ImgSubTitle = styled.div`
  font-size: ${(props) => props.theme.tinyFontSize};
  line-height: ${(props) => props.theme.tinyLineHeight};
  color: ${(props) => props.theme.greyColor};

  display: none;
  @media (max-width: 539px) {
    display: block;
  }
`;
const ImgTitle = styled.div`
  font-size: ${(props) => props.theme.descriptionFontSize};
  line-height: ${(props) => props.theme.descriptionLineHeight};

  font-weight: bold;
  padding-top: 8px;
  display: none;
  @media (max-width: 539px) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: contain;

  background-color: ${(props) => props.theme.bgColor};

  @media (max-width: 539px) {
    height: inherit;
    max-height: 20rem;
  }
`;

const DescriptionTitleWrapper = styled.div`
  margin-bottom: 1rem;
`;

const DescriptionTitle = styled.h3`
  text-indent: 0;
  font-size: ${(props) => props.theme.descriptionFontSize};
  line-height: ${(props) => props.theme.descriptionLineHeight};
  font-weight: bold;
`;

const DescriptionSubTitle = styled.span`
  text-indent: 0;
  font-size: ${(props) => props.theme.tinyFontSize};
  line-height: ${(props) => props.theme.tinyLineHeight};
  color: ${(props) => props.theme.greyColor};
  padding-right: 8px;
`;
const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1 1 0;
  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: ${(props) => props.theme.descriptionLineHeight};
  width: 100%;
  line-height: normal;
  text-indent: 0.4rem;

  @media (max-width: 539px) {
    display: none;
  }
`;

const SeeMore = styled.span`
  margin-left: 8px;
`;

const MoreButton = styled.button`
  margin-top: 2px;
  font-size: ${(props) => props.theme.tinyFontSize};
  line-height: ${(props) => props.theme.tinyLineHeight};
  color: ${(props) => props.theme.textColor};

  &:hover {
    color: ${(props) => props.theme.greyColor};
  }
`;

const NewsCard = ({ index, datas, handleClickCard, year }: NewsCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const newsData = datas[index];
  const commenter = datas[index].description.slice(0, 150);

  const handleLoding = () => {
    setIsLoading(true);
  };

  return (
    <Container onClick={() => handleClickCard(newsData.id)}>
      <AnchoreContainer href={`/news/${year}/${newsData.id}`} onClick={(e) => e.preventDefault()}>
        <ImgWrapper>
          {isLoading ? <Img loading="lazy" alt={newsData.title + newsData.author} src={newsData.imgSrcs[0] ? newsData.imgSrcs[0] : Constants.LOGO_BLACK} /> : <SkeletonThumbnail />}
          <img alt={newsData.title + newsData.author} src={newsData.imgSrcs[0] ? newsData.imgSrcs[0] : Constants.LOGO_BLACK} style={{ display: "none" }} onLoad={handleLoding} />
          <Col>
            <ImgTitle>{newsData.title}</ImgTitle>
            <ImgSubTitle>{newsData.author}</ImgSubTitle>
            <ImgSubTitle>{newsData.tags}</ImgSubTitle>
          </Col>
        </ImgWrapper>
        <DescriptionWrapper>
          <DescriptionTitleWrapper>
            <Col>
              <DescriptionTitle>{newsData.title}</DescriptionTitle>
              <Col>
                <DescriptionSubTitle>{newsData.author}</DescriptionSubTitle>
                <DescriptionSubTitle>{newsData.tags}</DescriptionSubTitle>
              </Col>
            </Col>
          </DescriptionTitleWrapper>
          <div>
            {commenter}
            <SeeMore>
              <MoreButton>...자세히 보기</MoreButton>
            </SeeMore>
          </div>
        </DescriptionWrapper>
      </AnchoreContainer>
    </Container>
  );
};

export default NewsCard;
