import styled from "styled-components";
import useLazyImage from "../../Hooks/useLazyImage";
import SkeletonThumbnail from "../Skeletons/SkeletonThumbnail";
import { useState } from "react";

type ThumbnailCardProps = {
  imgSrc: string;
  dateTime: string;
  index: number;
  handleClickCard: (index: number) => void;
};

const ImgWrapper = styled.div`
  width: 100%;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  &:after {
    display: block;
    content: "";
    padding-bottom: 100%;
  }
`;

const HoveredContainer = styled.div`
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  font-size: 3vw;
  color: ${(props) => props.theme.bgColor};
  @media (min-width: 540px) {
    ${ImgWrapper}:hover & {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  @media (min-width: 540px) {
    ${ImgWrapper}:hover & {
      filter: brightness(50%);
    }
  }
`;
function ThumbnailCard({
  imgSrc,
  dateTime,
  index,
  handleClickCard,
}: ThumbnailCardProps) {
  // const { imgRef, isLoading, setIsLoading } = useLazyImage();
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    handleClickCard(index);
  }

  function handleLoad() {
    setIsLoading(true);
    console.log(isLoading);
  }

  return (
    // <ImgWrapper onClick={handleClick} ref={imgRef}>
    <ImgWrapper onClick={handleClick}>
      {isLoading ? (
        <Thumbnail loading="lazy" src={imgSrc} alt={"훈련 일지: " + dateTime} />
      ) : (
        <SkeletonThumbnail />
      )}
      <img
        src={imgSrc}
        alt={"훈련 일지: " + dateTime}
        style={{ display: "none" }}
        onLoad={handleLoad}
      />

      <HoveredContainer>{dateTime}</HoveredContainer>
    </ImgWrapper>
  );
}

export default ThumbnailCard;
