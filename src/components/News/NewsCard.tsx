import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import PhotoModal from "../Modals/PhotoModal";

import { redirect } from "react-router-dom";
import useBodyScrollLock from "../../Hooks/useBodyScrollLock";
import useKeyEscClose from "../../Hooks/useKeyEscClose";
import { Constants } from "../../constant/constant";
import Col from "../../layouts/Col";
import Row from "../../layouts/Row";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import SkeletonThumbnail from "../Skeletons/SkeletonThumbnail";

type NewsCardProps = {
  index: number;
  datas: ArticleInfoType[];
  selectedIndex?: number;
};

const Container = styled.div`
  width: 100%;
  max-height: 30rem;

  font-size: ${(props) => props.theme.descriptionFontSize};

  display: flex;
  border-radius: 1rem;
  padding: 2rem 0rem;

  transition: all 0.5s;
  cursor: pointer;

  @media (min-width: 540px) {
    &:hover {
      transform: scale3d(1.01, 1.01, 1.01);
      box-shadow: 0.2rem 0.4rem 1.6rem rgb(0 0 0 / 16%);
    }
  }
`;

const ImgWrapper = styled.div`
  width: 50%;
  padding: 0rem 1rem;
  @media (max-width: 539px) {
    width: 100%;
    padding: 0rem;
  }
`;

const ImgSubTitle = styled.div`
  font-size: ${(props) => props.theme.tinyFontSize};
  color: ${(props) => props.theme.greyColor};
  padding-top: 0.5rem;
  display: none;
  @media (max-width: 539px) {
    display: block;
  }
`;
const ImgTitle = styled.div`
  font-size: ${(props) => props.theme.descriptionFontSize};
  font-weight: bold;
  padding-top: 0.5rem;
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
  border-radius: 0.5rem;
  object-fit: cover;

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
  font-weight: bold;
`;

const DescriptionSubTitle = styled.span`
  text-indent: 0;
  font-size: ${(props) => props.theme.tinyFontSize};
  color: ${(props) => props.theme.greyColor};
  padding-right: 0.5rem;
`;
const DescriptionWrapper = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
  width: 100%;
  padding: 0 1rem;
  line-height: normal;
  text-indent: 0.4rem;

  @media (max-width: 539px) {
    display: none;
  }
`;

const SeeMore = styled.span``;
const MoreButton = styled.button`
  margin-top: 2px;
  font-size: ${(props) => props.theme.tinyFontSize};

  color: ${(props) => props.theme.textColor};

  &:hover {
    color: ${(props) => props.theme.greyColor};
  }
`;

function NewsCard({ index, datas, selectedIndex }: NewsCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { lockScroll, openScroll } = useBodyScrollLock();
  const comment = datas[index].description;

  const [isMore, setIsMore] = useState<boolean>(false);
  const textLimit = useRef<number>(250);

  const commenter = useMemo(
    () => comment.slice(0, textLimit.current),
    [comment]
  );

  const openSeeMore = useCallback(() => {
    setIsMore(true);
    lockScroll();
  }, [lockScroll]);

  const closeSeeMore = () => {
    setIsMore(false);
    openScroll();
  };

  const handleLoding = () => {
    setIsLoading(true);
  };

  const escKey = useKeyEscClose(closeSeeMore);

  useEffect(() => {
    if (selectedIndex === index) {
      openSeeMore();
    } else {
      redirect("./news/2022");
    }
  }, [index, openSeeMore, selectedIndex]);

  return (
    <>
      {/* <Container onClick={openSeeMore} ref={imgRef}> */}
      <Container onClick={openSeeMore}>
        <ImgWrapper>
          {isLoading ? (
            <Img
              loading="lazy"
              alt={datas[index].title + datas[index].author}
              src={
                datas[index].imgSrcs[0]
                  ? datas[index].imgSrcs[0]
                  : Constants.LOGO_BLACK
              }
            />
          ) : (
            <SkeletonThumbnail />
          )}
          <img
            alt={datas[index].title + datas[index].author}
            src={
              datas[index].imgSrcs[0]
                ? datas[index].imgSrcs[0]
                : Constants.LOGO_BLACK
            }
            style={{ display: "none" }}
            onLoad={handleLoding}
          />

          <Col>
            <ImgTitle>{datas[index].title}</ImgTitle>
            <ImgSubTitle>{datas[index].author}</ImgSubTitle>
            <ImgSubTitle>{datas[index].tags}</ImgSubTitle>
          </Col>
        </ImgWrapper>

        <DescriptionWrapper>
          <DescriptionTitleWrapper>
            <Col>
              <DescriptionTitle>{datas[index].title}</DescriptionTitle>
              <Row>
                <DescriptionSubTitle>{datas[index].author}</DescriptionSubTitle>
                <DescriptionSubTitle>{datas[index].tags}</DescriptionSubTitle>
              </Row>
            </Col>
          </DescriptionTitleWrapper>
          {commenter}
          <SeeMore>
            <br />
            <MoreButton>...자세히 보기</MoreButton>
          </SeeMore>
        </DescriptionWrapper>
      </Container>
      {isMore ? (
        <PhotoModal
          open={isMore}
          close={closeSeeMore}
          infos={datas}
          index={index}
          titles={["작성자", "태그", "작성 일자"]}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default NewsCard;
