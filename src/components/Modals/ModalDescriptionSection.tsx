import React from "react";
import styled from "styled-components";

type ModalDescriptionSectionProps = {
  title: string;
  dateTime: string;
  subTitle: string[];
  description: string;
};

const DescriptionSection = styled.section``;

const DescriptionTitle = styled.h3``;

const DateTime = styled.div``;

const SubTitle = styled.div``;

const Description = styled.div``;

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
      <SubTitle>{subTitle}</SubTitle>
      <Description>{description}</Description>
    </DescriptionSection>
  );
}

export default ModalDescriptionSection;
