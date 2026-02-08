import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useLatestNews } from "@/features/seo/news/hooks/use-latest-news";
import { Constants } from "@/shared/lib/constant";
import { v2Api } from "@packages/api";
import { MoreCard } from "./MoreCard";

const HomeSectionMore = () => {
  const { news } = useLatestNews();

  const { data: trainings } = v2Api.useGetApiV2TrainingsSuspense(undefined, {
    query: {
      select: (response) => response.data.trainingLogs ?? [],
    },
  });
  const { data: notices } = v2Api.useGetApiV2NoticesSuspense(undefined, {
    query: {
      select: (response) => response.data.notices ?? [],
    },
  });

  return (
    <SheetWrapper>
      <div className="flex flex-col w-full max-w-4xl mx-auto my-16 px-4">
        <Title
          title={"게시글 전체보기"}
          color={Constants.LOGO_BLACK}
          heading={2}
        />
        <div className="flex flex-col gap-6 w-full pt-5">
          <MoreCard title="훈련일지" linkTo="/photo" data={trainings} />
          <MoreCard
            title="지호지"
            linkTo={`/news`}
            data={news.map((n) => {
              const year = new Date(n.dateTime).getFullYear();
              const { id, ...rest } = n;
              return { id: `${year}/${id}`, ...rest };
            })}
          />
          <MoreCard title="공지사항" linkTo="/notice" data={notices} />
        </div>
      </div>
    </SheetWrapper>
  );
};

export default HomeSectionMore;
