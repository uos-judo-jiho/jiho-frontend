import React from "react";
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
  padding: 16px;
`;

const DescriptionTitle = styled.h3`
  width: 100%;
`;

const DateTime = styled.div`
  width: 100%;
`;

const SubTitle = styled.div`
  width: 100%;
`;

const Description = styled.div`
  width: 100%;
  max-height: calc(100vh - 32px);
  text-align: justify;
  line-height: normal;
  overflow-y: auto;
  overflow-x: hidden;
`;

function ModalDescriptionSection({
  title,
  dateTime,
  subTitle,
  description,
}: ModalDescriptionSectionProps) {
  return (
    <DescriptionSection>
      <DescriptionTitle>{title}</DescriptionTitle>
      <DateTime>{dateTime}</DateTime>
      <SubTitle>{formatStringArray(subTitle)}</SubTitle>
      <Line margin={"12px 0px"} borderWidth={"1px"} />
      <Description>{description}</Description>
    </DescriptionSection>
  );
}

export default ModalDescriptionSection;
