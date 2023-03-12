import React from "react";
import styled from "styled-components";
import { Constants } from "../../constant/constant";
import useLazyImage from "../../Hooks/useLazyImage";

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
  const { imgRef, isLoading } = useLazyImage();

  function handleClick() {
    handleClickCard(index);
  }

  return (
    <ImgWrapper onClick={handleClick}>
      <Thumbnail
        loading="lazy"
        ref={imgRef}
        src={isLoading ? imgSrc : Constants.BG_COLOR_808080}
        alt={"훈련 일지: " + dateTime}
      />
      <HoveredContainer>{dateTime}</HoveredContainer>
    </ImgWrapper>
  );
}

export default ThumbnailCard;
