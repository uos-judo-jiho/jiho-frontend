import { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import PhotoModal from "../Modals/PhotoModal";

// TODO API 뉴스
import Row from "../../layouts/Row";
import { ArticleInfoTpye } from "../../types/ArticleInfoTpye";
import { useKeyEscClose } from "../../Hooks/useKeyEscClose";

type NewsCardProps = {
  index: number;
  datas: ArticleInfoTpye[];
};

const Container = styled.div`
  width: 100%;
  display: flex;
  border-radius: 1rem;
  padding: 2rem 1rem;
  transition: all 0.5s;
  cursor: pointer;

  &:hover {
    transform: scale3d(1.01, 1.01, 1.01);
    box-shadow: 2px 4px 16px rgb(0 0 0 / 16%);
  }
`;

const ImgWrapper = styled.div`
  width: 50%;
  @media (max-width: 539px) {
    width: 100%;
  }
`;

const Imgtitle = styled.div`
  font-size: 1rem;
  padding-top: 0.5rem;
  display: none;
  @media (max-width: 539px) {
    display: block;
  }
`;

const Img = styled.img`
  width: 100%;
  border-radius: 0.5rem;
`;

const DescriptionWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;
  line-height: normal;
  text-indent: 0.4rem;

  @media (max-width: 539px) {
    display: none;
  }
  /* word-break: keep-all; */
`;

const SeeMore = styled.span``;
const MoreButton = styled.button`
  margin-top: 2px;
  font-size: ${(props) => props.theme.tinyFontSize};

  color: ${(props) => props.theme.textColor};
`;

function NewsCard({ index, datas }: NewsCardProps) {
  const escKey = useKeyEscClose(closeSeeMore);
  const comment = datas[index].description;

  const [isMore, setIsMore] = useState<boolean>(false);
  const textLimit = useRef<number>(200);

  const commenter = useMemo(() => {
    const shortText: string = comment.slice(0, textLimit.current);

    return shortText;
  }, []);

  function openSeeMore() {
    setIsMore(true);
  }
  function closeSeeMore() {
    setIsMore(false);
  }
  return (
    <>
      <Container onClick={openSeeMore}>
        {/* TODO img src */}
        <ImgWrapper>
          <Img
            src={require("../../assets/images/trainingLog/" +
              datas[index].imgSrcs[0])}
          />
          <Imgtitle>{datas[index].author}</Imgtitle>
        </ImgWrapper>
        <DescriptionWrapper>
          {commenter}
          <SeeMore>
            <br />
            <MoreButton>...더보기</MoreButton>
          </SeeMore>
        </DescriptionWrapper>
      </Container>
      {isMore ? (
        <PhotoModal
          open={isMore}
          close={closeSeeMore}
          infos={datas}
          index={index}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default NewsCard;
