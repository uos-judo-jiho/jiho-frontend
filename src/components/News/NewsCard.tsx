import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Col from "../../layouts/Col";

import demoImg from "../../assets/images/demo.jpg";
import PhotoModal from "../Modals/PhotoModal";

import DemoData from "../../assets/jsons/trainingLog.json";

const Container = styled.div`
  width: 100%;
  padding: 2rem 0;
  &:hover {
    cursor: pointer;
  }
`;

const Img = styled.img`
  width: 50%;
`;

const DescriptionWrapper = styled.div`
  width: 100%;
  padding: 1rem 0;
  word-break: keep-all;
`;

const SeeMore = styled.span``;
const MoreButton = styled.button`
  margin-top: 2px;
  font-size: ${(props) => props.theme.tinyFontSize};

  color: ${(props) => props.theme.textColor};
`;

function NewsCard() {
  const demoData = DemoData.trainingLogs;
  const comment = demoData[0].description;

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
          index={0}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default NewsCard;
