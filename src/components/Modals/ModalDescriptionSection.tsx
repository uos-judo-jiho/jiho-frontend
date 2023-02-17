import styled from "styled-components";
import Line from "../../layouts/Line";
import { formatStringArray } from "../../utils/Utils";

type ModalDescriptionSectionProps = {
  title: string;
  dateTime: string;
  subTitle: string[];
  description: string;
};

const DescriptionSection = styled.section`
  height: inherit;
  width: inherit;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const DescriptionHeader = styled.div`
  width: 100%;
  line-height: normal;
`;

const DescriptionTitle = styled.h3``;

const DateTime = styled.div``;

const SubTitle = styled.div``;

const DescriptionWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  text-align: justify;
  line-height: normal;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Description = styled.p`
  text-indent: 0.4em;
`;

const ModalFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
`;

function ModalDescriptionSection({
  title,
  dateTime,
  subTitle,
  description,
}: ModalDescriptionSectionProps) {
  return (
    <DescriptionSection>
      <DescriptionHeader>
        <DescriptionTitle>{title}</DescriptionTitle>
        <DateTime>{dateTime}</DateTime>
        <SubTitle>{formatStringArray(subTitle)}</SubTitle>
      </DescriptionHeader>
      <Line margin={"10px 0px"} borderWidth={"1px"} />
      <DescriptionWrapper>
        {description.split("\n").map((line) => {
          return (
            <Description>
              {line}
              <br />
            </Description>
          );
        })}
      </DescriptionWrapper>

      {/* TODO 좋아요 버튼 만들기 */}
      <ModalFooter>
        <Line margin={"10px 0px"} borderWidth={"1px"} />
        좋아요 버튼 1
      </ModalFooter>
    </DescriptionSection>
  );
}

export default ModalDescriptionSection;
