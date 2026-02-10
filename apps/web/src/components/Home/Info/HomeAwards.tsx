import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import { AwardType } from "@/shared/lib/types/AwardType";
import { formatAwardsType } from "@/shared/lib/utils/Utils";
import { v2Api } from "@packages/api";

const AwardItem = ({ award }: { award: AwardType }) => {
  return (
    <li className="flex flex-col gap-0.5 my-4 leading-none [&:nth-last-child(n+3)]:hidden [&:nth-last-child(n+3)]:md:flex">
      <b>{award.title}</b>
      <span className="text-sm text-theme-light-grey mt-0.5">
        {formatAwardsType(award)}
      </span>
    </li>
  );
};

export const HomeAwards = () => {
  const { data: awards = [] } = v2Api.useGetApiV2AwardsSuspense({
    query: {
      select: (response) => response.data.awards ?? [],
    },
  });

  const metaDescription =
    awards.length > 0
      ? awards.map((award) => award.title).join(", ")
      : "서울시립대학교 유도부 지호";

  return (
    <div className="flex-1">
      <MyHelmet
        title="Home"
        description={metaDescription}
        imgUrl="/favicon-96x96.png"
      />
      <div className="flex flex-col">
        <Card className="bg-white/30 shadow-md backdrop-blur-sm border-none">
          <CardHeader>
            <h3 className="mb-3 text-theme-dark-grey font-semibold text-lg">
              수상 이력
            </h3>
          </CardHeader>
          <CardContent>
            <ul>
              {awards.map((award) => (
                <AwardItem key={award.id} award={award} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
