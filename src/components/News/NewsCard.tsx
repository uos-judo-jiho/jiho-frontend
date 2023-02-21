import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Col from "../../layouts/Col";

import demoImg from "../../assets/images/demo.jpg";
import PhotoModal from "../Modals/PhotoModal";

// TODO API 뉴스
import DemoData from "../../assets/jsons/trainingLog.json";

type NewsCardProps = {
  index: number;
};

const Container = styled.div`
  width: 100%;
  border-radius: 1rem;
  padding: 2rem 1rem;
  transition: all 0.5s;
  cursor: pointer;

  &:hover {
    scale: 101%;
    box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  }
`;

const Img = styled.img`
  width: 50%;
`;

const DescriptionWrapper = styled.div`
  width: 100%;
  padding: 1rem 0;
  line-height: normal;
  word-break: keep-all;
`;

const SeeMore = styled.span``;
const MoreButton = styled.button`
  margin-top: 2px;
  font-size: ${(props) => props.theme.tinyFontSize};

  color: ${(props) => props.theme.textColor};
`;

function NewsCard({ index }: NewsCardProps) {
  const demoData = DemoData.trainingLogs;
  const comment = demoData[index].description;

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
        <Col>
          <Img src={demoImg} />
          <DescriptionWrapper>
            {commenter}
            <SeeMore>
              <br />
              <MoreButton>...더보기</MoreButton>
            </SeeMore>
          </DescriptionWrapper>
        </Col>
      </Container>
      {isMore ? (
        <PhotoModal
          open={isMore}
          close={closeSeeMore}
          infos={demoData}
          index={index}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default NewsCard;
