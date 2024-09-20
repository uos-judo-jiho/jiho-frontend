import { useState } from "react";
import styled from "styled-components";
import SkeletonThumbnail from "../Skeletons/SkeletonThumbnail";

type ThumbnailCardProps = {
  imgSrc: string;
  dateTime: string;
  id: string;
  handleClickCard: (index: string) => void;
};

const ImgWrapper = styled.li`
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

  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 0;

  width: 100%;
  height: 100%;

  font-size: ${(props) => props.theme.titleFontSize};

  color: ${(props) => props.theme.bgColor};

  transition: opacity 0.287s;

  @media (min-width: 540px) {
    ${ImgWrapper}:hover & {
      opacity: 1;
    }
  }
`;

const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  width: 100%;
  aspect-ratio: 1/1;

  object-fit: cover;

  transition: filter 0.287s;

  @media (min-width: 540px) {
    ${ImgWrapper}:hover & {
      filter: brightness(50%);
    }
  }
`;
const ThumbnailCard = ({ imgSrc, dateTime, id, handleClickCard }: ThumbnailCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => handleClickCard(id);

  const handleLoad = () => setIsLoading(true);

  return (
    <ImgWrapper onClick={handleClick}>
      <a href={`/photo/${id}`} onClick={(e) => e.preventDefault()}>
        {isLoading ? <Thumbnail loading="lazy" src={imgSrc} alt={"훈련 일지: " + dateTime} /> : <SkeletonThumbnail />}
        <img src={imgSrc} alt={"훈련 일지: " + dateTime} style={{ display: "none" }} onLoad={handleLoad} />
        <HoveredContainer>{dateTime}</HoveredContainer>
      </a>
    </ImgWrapper>
  );
};

export default ThumbnailCard;
