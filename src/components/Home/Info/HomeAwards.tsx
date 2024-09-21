import Col from "../../../layouts/Col";

import styled from "styled-components";
import Awards from "../../../assets/jsons/awards.json";
import { AwardsType } from "../../../types/TAwards";
import { formaAwardsType } from "../../../utils/Utils";

const AwardsConatiner = styled.div`
  flex: 1 0 0;
`;

const AwardsItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2px;

  margin: 1rem 0;

  font-size: ${(props) => props.theme.descriptionFontSize};
  line-height: 100%;

  span {
    font-size: ${(props) => props.theme.defaultFontSize};
    line-height: ${(props) => props.theme.defaultLineHeight};
    color: ${(props) => props.theme.lightGreyColor};
  }

  @media (max-width: 859px) {
    :nth-last-child(n + 3) {
      display: none;
    }
  }
`;

const SubTitle = styled.h3`
  font-size: ${(props) => props.theme.subTitleFontSize};
  line-height: ${(props) => props.theme.subTitleLineHeight};
  margin-bottom: 12px;
`;

const AwardItem = ({ award }: { award: AwardsType }) => {
  return (
    <AwardsItem>
      <b>{award.title}</b>
      <span>{formaAwardsType(award)}</span>
    </AwardsItem>
  );
};

const HomeAwards = () => {
  const awards: AwardsType[] = Awards.awards;

  return (
    <AwardsConatiner>
      <Col>
        <SubTitle>수상 이력</SubTitle>
        <ul>
          {awards.map((award) => (
            <AwardItem key={award.title} award={award} />
          ))}
        </ul>
      </Col>
    </AwardsConatiner>
  );
};

export default HomeAwards;
