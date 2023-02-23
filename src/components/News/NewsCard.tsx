import { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import PhotoModal from "../Modals/PhotoModal";

// TODO API 뉴스
import Row from "../../layouts/Row";
import { ArticleInfoTpye } from "../../types/ArticleInfoTpye";

type NewsCardProps = {
  index: number;
  datas: ArticleInfoTpye[];
};

const Container = styled.div`
  width: 100%;
  border-radius: 1rem;
  padding: 2rem 1rem;
  transition: all 0.5s;
  cursor: pointer;

  &:hover {
    transform: scale3d(1.01, 1.01, 1.01);
    box-shadow: 2px 4px 16px rgb(0 0 0 / 16%);
  }
`;

const Img = styled.img`
  width: 50%;
`;

const DescriptionWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;
  line-height: normal;
  text-indent: 0.4rem;
  /* word-break: keep-all; */
`;

const SeeMore = styled.span``;
const MoreButton = styled.button`
  margin-top: 2px;
  font-size: ${(props) => props.theme.tinyFontSize};

  color: ${(props) => props.theme.textColor};
`;

function NewsCard({ index, datas }: NewsCardProps) {
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
        <Row>
          {/* TODO img src */}
          <Img
            src={require("../../assets/images/trainingLog/" +
              datas[index].imgSrcs[0])}
          />
          <DescriptionWrapper>
            {commenter}
            <SeeMore>
              <br />
              <MoreButton>...더보기</MoreButton>
            </SeeMore>
          </DescriptionWrapper>
        </Row>
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
