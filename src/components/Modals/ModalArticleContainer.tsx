import styled, { keyframes } from "styled-components";
import ImgSlider from "../../layouts/ImgSlider";
import MobileRowColLayout from "../../layouts/MobileRowColLayout";
import { ArticleInfoType } from "../../types/ArticleInfoType";
import ModalDescriptionSection from "./ModalDescriptionSection";

type ModalArticleContainerProsp = {
  info: ArticleInfoType;
  titles: string[];
};

const SlideUp = keyframes`
  from {
    transform: translateY(-100px);
  }
  to {
    transform: translateY(0px);
  }
`;

const ModalArticle = styled.article`
  width: 80vw;
  height: 80vh;
  margin: auto;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.bgColor};
  overflow: auto;

  animation-duration: 0.25s;
  animation-timing-function: ease-out;
  animation-name: ${SlideUp};
  animation-fill-mode: forwards;

  overflow: hidden;
  isolation: isolate;

  @media (max-width: 539px) {
    width: 100%;
    height: 95%;
    border-radius: 0.5rem 0.5rem 0 0;
    overflow: scroll;
    isolation: auto;
  }
`;

const Main = styled.main`
  position: relative;
  padding: 1rem;
  width: 100%;
  height: 100%;
`;

function ModalArticleContainer({ info, titles }: ModalArticleContainerProsp) {
  return (
    <ModalArticle
    // onTouchStart={onTouchStart}
    // onTouchEnd={onTouchEnd}
    // onMouseDown={onMouseDown}
    // onMouseUp={onMouseUp}
    >
      <Main>
        {/* 모바일 환경에서 드래그로 모달 닫는 액션 */}
        {/* <MobileSlideBarWrapper>
              <MobileSlideBar />
            </MobileSlideBarWrapper> */}
        {/* <CloseBtn onClick={close}>
              <StyledClose />
            </CloseBtn> */}
        <MobileRowColLayout>
          <ImgSlider datas={info.imgSrcs} />
          <ModalDescriptionSection article={info} titles={titles} />
        </MobileRowColLayout>
      </Main>
    </ModalArticle>
  );
}

export default ModalArticleContainer;
