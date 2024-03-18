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
  display: none;
  width: 100%;
  height: 100%;
  font-size: 3.2rem;
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
const ThumbnailCard = ({
  imgSrc,
  dateTime,
  id,
  handleClickCard,
}: ThumbnailCardProps) => {
  // const { imgRef, isLoading, setIsLoading } = useLazyImage();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => handleClickCard(id);

  const handleLoad = () => setIsLoading(true);

  return (
    <ImgWrapper onClick={handleClick}>
      <a href={`/photo?p=${id}`} onClick={(e) => e.preventDefault()}>
        {isLoading ? (
          <Thumbnail
            loading="lazy"
            src={imgSrc}
            alt={"훈련 일지: " + dateTime}
          />
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
      </a>
    </ImgWrapper>
  );
};

export default ThumbnailCard;
