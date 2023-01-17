import React from "react";
import styled from "styled-components";

type ThumbnailCardProps = {
  imgSrc: string;
  handleClickCard: Function;
};

const ImgWrapper = styled.button`
  position: relative;
`;

const HoveredContainer = styled.div`
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  font-size: ${(props) => props.theme.subTitleFontSize};
  color: ${(props) => props.theme.bgColor};
  ${ImgWrapper}:hover & {
    display: block;
  }
`;

const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${ImgWrapper}:hover & {
    filter: brightness(50%);
  }
`;
function ThumbnailCard({ imgSrc, handleClickCard }: ThumbnailCardProps) {
  function handleClick() {
    handleClickCard();
  }
  return (
    <ImgWrapper onClick={handleClick}>
      <Thumbnail src={imgSrc} />
      <HoveredContainer>2022.10.10</HoveredContainer>
    </ImgWrapper>
  );
}

export default ThumbnailCard;
