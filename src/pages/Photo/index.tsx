import styled from "styled-components";
import PhotoMobile from "./PhotoMobile";
import PhotoPC from "./PhotoPC";

const PhotoBranch = styled.div`
  & > :first-child {
    @media (max-width: 539px) {
      display: none;
    }
  }

  & > :last-child {
    @media (min-width: 540px) {
      display: none;
    }
  }
`;

const PhotoPage = () => {
  return (
    <PhotoBranch>
      <PhotoPC />
      <PhotoMobile />
    </PhotoBranch>
  );
};

export default PhotoPage;
