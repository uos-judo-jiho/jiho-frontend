import React from "react";
import Col from "../../../layouts/Col";

import Awards from "../../../assets/jsons/awards.json";
import styled from "styled-components";

const AwardsItem = styled.li`
  margin: 10px 0;
  font-size: ${(props) => props.theme.descriptionFontSize};
`;

type TAwards = {
  title: string;
  gold: number;
  silver: number;
  bronze: number;
  menGroup: number;
  womenGroup: number;
  group: number;
};

function HomeAwards() {
  const awards: TAwards[] = Awards.awards;

  function formatAwards(award: TAwards): string {
    let result: string = award.title + " | ";

    if (award.gold > 0) {
      result += " 금 ";
      result += award.gold;
    }
    if (award.silver > 0) {
      result += " 은 ";
      result += award.silver;
    }
    if (award.bronze > 0) {
      result += " 동 ";
      result += award.bronze;
    }
    if (award.menGroup > 0) {
      result += " 남자 단체전 ";
      result += award.menGroup;
    }
    if (award.womenGroup > 0) {
      result += " 여자 단체전 ";
      result += award.womenGroup;
    }
    if (award.group > 0) {
      result += " 혼성 단체전 ";
      result += award.group;
    }

    return result;
  }

  return (
    <ul>
      {awards.map((award) => {
        return <AwardsItem key={award.title}>{formatAwards(award)}</AwardsItem>;
      })}
    </ul>
  );
}

export default HomeAwards;
