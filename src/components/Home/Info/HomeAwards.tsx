import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MyHelmet from "@/helmet/MyHelmet";
import { awardsData } from "@/lib/assets/data/awards";
import { AwardType } from "@/lib/types/AwardType";
import { formatAwardsType } from "@/lib/utils/Utils";
import styled from "styled-components";

const AwardsContainer = styled.div`
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
      <span>{formatAwardsType(award)}</span>
    </AwardsItem>
  );
};

const HomeAwards = () => {
  const awards: AwardType[] = awardsData.awards;

  return (
    <AwardsContainer>
      <MyHelmet
        title="Home"
        description={awards.map((award) => award.title).join(", ")}
        imgUrl="/favicon-96x96.png"
      />
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
    </AwardsContainer>
  );
};

export default HomeAwards;
