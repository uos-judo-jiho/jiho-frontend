import { Card, CardContent, CardHeader } from "@/components/ui/card";
import styled from "styled-components";
import Awards from "../../../assets/jsons/awards.json";
import { AwardType } from "../../../types/AwardType";
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

const AwardItem = ({ award }: { award: AwardType }) => {
  return (
    <AwardsItem>
      <b>{award.title}</b>
      <span>{formaAwardsType(award)}</span>
    </AwardsItem>
  );
};

const HomeAwards = () => {
  const awards: AwardType[] = Awards.awards;

  return (
    <AwardsConatiner>
      <div className="flex flex-col">
        <Card className="bg-white/30 shadow-md backdrop-blur-sm border-none">
          <CardHeader>
            <SubTitle>수상 이력</SubTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {awards.map((award) => (
                <AwardItem key={award.title} award={award} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AwardsConatiner>
  );
};

export default HomeAwards;
