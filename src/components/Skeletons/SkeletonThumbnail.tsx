import styled from "styled-components";
import SkeletonItem from "./SkeletonItem";

const Container = styled.div`
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
`;

function SkeletonThumbnail() {
  return (
    <Container>
      <SkeletonItem></SkeletonItem>
    </Container>
  );
}

export default SkeletonThumbnail;
