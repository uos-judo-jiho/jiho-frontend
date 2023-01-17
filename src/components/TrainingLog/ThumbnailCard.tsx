import React from "react";
import styled from "styled-components";
type ThumbnailCardProps = {
  imgSrc: string;
  handleClickCard: Function;
};

const ImgWrapper = styled.button``;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
function ThumbnailCard({ imgSrc, handleClickCard }: ThumbnailCardProps) {
  function handleClick() {
    handleClickCard();
  }
  return (
    <ImgWrapper onClick={handleClick}>
      <Thumbnail src={imgSrc} />
    </ImgWrapper>
  );
}

export default ThumbnailCard;
