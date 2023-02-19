import styled, { css } from "styled-components";
import Line from "../../layouts/Line";
import Row from "../../layouts/Row";
import { formatStringArray } from "../../utils/Utils";
import { ReactComponent as HeartLine } from "../../assets/svgs/heart-line.svg";
import { ReactComponent as HeartFill } from "../../assets/svgs/heart-fill.svg";
import { useState } from "react";

type ModalDescriptionSectionProps = {
  title: string;
  dateTime: string;
  author: string;
  subTitle: string[];
  description: string;
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
  flex: 0;
`;
const DescriptionHeaderTable = styled.table`
  width: 100%;
`;

const DescriptionHeaderTableTd = styled.td`
  width: 5rem;
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

const Description = styled.p`
  text-indent: 0.4em;
`;

const ModalFooter = styled.div`
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
  title,
  dateTime,
  author,
  subTitle,
  description,
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
          <tr>
            <DescriptionHeaderTableTd>작성자</DescriptionHeaderTableTd>
            <td>{author}</td>
          </tr>
          <tr>
            <DescriptionHeaderTableTd>운동 날짜</DescriptionHeaderTableTd>
            <td>{dateTime}</td>
          </tr>
          <tr>
            <DescriptionHeaderTableTd>참여 인원</DescriptionHeaderTableTd>
            <td>{formatStringArray(subTitle)}</td>
          </tr>
        </DescriptionHeaderTable>
      </DescriptionHeader>
      <Line margin={"10px 0"} borderWidth={"1px"} />
      <DescriptionWrapper>
        {description.split("\n").map((line, index) => {
          return (
            <Description key={"description-p-tag" + index}>
              {line}
              <br />
            </Description>
          );
        })}
      </DescriptionWrapper>
      {/* TODO 좋아요 버튼 state 관리 */}
      <ModalFooter>
        <Line margin={"10px 0"} borderWidth={"1px"} />
        <Row alignItems="center">
          <HeartButton onClick={handleHeart}>
            {clickedHeart ? <StyledHeartFill /> : <StyledHeartLine />}
            <HeartCountSpan>{heartCount}</HeartCountSpan>
          </HeartButton>
        </Row>
      </ModalFooter>
    </DescriptionSection>
  );
}

export default ModalDescriptionSection;
