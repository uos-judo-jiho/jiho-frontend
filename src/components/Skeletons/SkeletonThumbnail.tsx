import styled from "styled-components";
import SkeletonItem from "./SkeletonItem";

const Container = styled.div`
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
`;

const SkeletonThumbnail = () => {
  return (
    <Container>
      <SkeletonItem></SkeletonItem>
    </Container>
  );
};

export default SkeletonThumbnail;
