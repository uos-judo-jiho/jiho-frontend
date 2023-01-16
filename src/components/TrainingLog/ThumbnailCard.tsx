import React from "react";
import styled from "styled-components";
type ThumbnailCardProps = {
  imgSrc: string;
};

const Thumbnail = styled.img``;
function ThumbnailCard({ imgSrc }: ThumbnailCardProps) {
  return <Thumbnail src={imgSrc} />;
}

export default ThumbnailCard;
