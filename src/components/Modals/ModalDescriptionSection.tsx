import styled, { css } from "styled-components";
import Line from "../../layouts/Line";
import Row from "../../layouts/Row";
import { formatStringArray } from "../../utils/Utils";
import { ReactComponent as HeartLine } from "../../assets/svgs/heart-line.svg";
import { ReactComponent as HeartFill } from "../../assets/svgs/heart-fill.svg";
import { useState } from "react";
import { ArticleInfoType } from "../../types/ArticleInfoType";

type ModalDescriptionSectionProps = {
  article: ArticleInfoType;
  titles: string[];
};

const DescriptionSection = styled.section`
  height: inherit;
  width: inherit;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const DescriptionHeader = styled.div`
  width: 100%;
  line-height: normal;
  flex: 0 0 auto;
`;
const DescriptionHeaderTable = styled.table`
  width: 100%;
`;

const DescriptionHeaderTableTdTitle = styled.td`
  width: 5rem;
`;

const DescriptionHeaderTdContent = styled.td`
  word-break: keep-all;
`;

const DescriptionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: justify;
  line-height: normal;
  overflow-y: auto;
  overflow-x: hidden;
`;

const DescriptionTitle = styled.h3`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  text-indent: 0.4em;
`;

const DescriptionFooter = styled.div`
  flex: 0;
  /* position: absolute;
  bottom: 0;
  left: 1em;
  right: 1em; */
`;

const HeartButton = styled.button`
  text-align: center;
  background: none;
`;

const HeartStyle = css`
  width: 1.5em;
  height: 1.5em;
  vertical-align: -7px;
  background-color: transparent;
`;

const StyledHeartLine = styled(HeartLine)`
  ${HeartStyle}

  &:hover {
    opacity: 0.7;
  }
`;
const StyledHeartFill = styled(HeartFill)`
  ${HeartStyle}
`;

const HeartCountSpan = styled.span`
  font-size: 0.75em;
  margin-left: 0.5em;
`;

function ModalDescriptionSection({
  article,
  titles,
}: ModalDescriptionSectionProps) {
  const [clickedHeart, setClickedHeart] = useState(false);
  const [heartCount, setHeartCount] = useState(0);

  function handleHeart() {
    if (!clickedHeart) {
      setHeartCount((prev) => prev + 1);
    } else {
      setHeartCount((prev) => prev - 1);
    }
    setClickedHeart((prev) => !prev);
  }
  return (
    <DescriptionSection>
      <DescriptionHeader>
        <DescriptionHeaderTable>
          <tbody>
            <tr>
              <DescriptionHeaderTableTdTitle>
                {titles[0]}
              </DescriptionHeaderTableTdTitle>
              <DescriptionHeaderTdContent>
                {article.author}
              </DescriptionHeaderTdContent>
            </tr>
            <tr>
              <DescriptionHeaderTableTdTitle>
                {titles[1]}
              </DescriptionHeaderTableTdTitle>
              <DescriptionHeaderTdContent>
                {formatStringArray(article.tags)}
              </DescriptionHeaderTdContent>
            </tr>
            <tr>
              <DescriptionHeaderTableTdTitle>
                {titles[2]}
              </DescriptionHeaderTableTdTitle>
              <DescriptionHeaderTdContent>
                {article.dateTime}
              </DescriptionHeaderTdContent>
            </tr>
          </tbody>
        </DescriptionHeaderTable>
        <Line margin={"10px 0"} borderWidth={"1px"} />
      </DescriptionHeader>
      <DescriptionWrapper>
        <DescriptionTitle>{article.title}</DescriptionTitle>
        <Description>
          {article.description.split("\n").map((line) => {
            return (
              <>
                {line}
                <br />
              </>
            );
          })}
        </Description>
      </DescriptionWrapper>
      <DescriptionFooter>
        <Line margin={"10px 0"} borderWidth={"1px"} />
        {/* TODO 좋아요 버튼 state 관리 완류 후 아래 코드 활성화*/}
        {/* <Row alignItems="center">
          <HeartButton onClick={handleHeart}>
            {clickedHeart ? <StyledHeartFill /> : <StyledHeartLine />}
            <HeartCountSpan>{heartCount}</HeartCountSpan>
          </HeartButton>
        </Row> */}
      </DescriptionFooter>
    </DescriptionSection>
  );
}

export default ModalDescriptionSection;
