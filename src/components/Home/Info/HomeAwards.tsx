import React from "react";
import Col from "../../../layouts/Col";

import Awards from "../../../assets/jsons/awards.json";
import styled from "styled-components";
import { AwardsType } from "../../../types/TAwards";
import { formaAwardsType } from "../../../utils/Utils";

const AwardsItem = styled.li`
  margin: 1rem 0;
  font-size: ${(props) => props.theme.descriptionFontSize};
  line-height: ${(props) => props.theme.descriptionLineHeight};
`;

const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
  line-height: ${(props) => props.theme.subTitleLineHeight};
  margin-bottom: 1.2rem;
`;

function HomeAwards() {
  const awards: AwardsType[] = Awards.awards;

  return (
    <Col>
      <SubTitle>수상 이력</SubTitle>
      <ul>
        {awards.map((award) => (
          <AwardsItem key={award.title}>{formaAwardsType(award)}</AwardsItem>
        ))}
      </ul>
    </Col>
  );
}

export default HomeAwards;
