import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MyHelmet from "@/helmet/MyHelmet";
import { awardsData } from "@/lib/assets/data/awards";
import { AwardType } from "@/lib/types/AwardType";
import { formatAwardsType } from "@/lib/utils/Utils";

const AwardItem = ({ award }: { award: AwardType }) => {
  return (
    <li
      className="flex flex-col gap-0.5 my-4 leading-none [&:nth-last-child(n+3)]:md:hidden"
      style={{ fontSize: "var(--theme-font-description)" }}
    >
      <b>{award.title}</b>
      <span
        style={{
          fontSize: "var(--theme-font-default)",
          lineHeight: "var(--theme-line-default)",
          color: "var(--theme-light-grey)",
        }}
      >
        {formatAwardsType(award)}
      </span>
    </li>
  );
};

const HomeAwards = () => {
  const awards: AwardType[] = awardsData.awards;

  return (
    <div className="flex-1">
      <MyHelmet
        title="Home"
        description={awards.map((award) => award.title).join(", ")}
        imgUrl="/favicon-96x96.png"
      />
      <div className="flex flex-col">
        <Card className="bg-white/30 shadow-md backdrop-blur-sm border-none">
          <CardHeader>
            <h3
              className="mb-3"
              style={{
                fontSize: "var(--theme-font-subtitle)",
                lineHeight: "var(--theme-line-subtitle)",
              }}
            >
              수상 이력
            </h3>
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
    </div>
  );
};

export default HomeAwards;
