import React from "react";
import styled from "styled-components";

type ThumbnailCardProps = {
  imgSrc: string;
  dateTime: string;
  handleClickCard: Function;
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
  font-size: ${(props) => props.theme.subTitleFontSize};
  color: ${(props) => props.theme.bgColor};
  ${ImgWrapper}:hover & {
    display: flex;
    justify-content: center;
    align-items: center;
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
function ThumbnailCard({
  imgSrc,
  dateTime,
  handleClickCard,
}: ThumbnailCardProps) {
  function handleClick() {
    handleClickCard();
  }
  return (
    <ImgWrapper onClick={handleClick}>
      <Thumbnail src={imgSrc} />
      <HoveredContainer>{dateTime}</HoveredContainer>
    </ImgWrapper>
  );
}

export default ThumbnailCard;
