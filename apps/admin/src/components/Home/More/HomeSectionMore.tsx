import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { Constants } from "@/shared/lib/constant";
import { vaildNewsYearList } from "@/shared/lib/utils/Utils";
import { v1Api } from "@packages/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import MoreCard from "./MoreCard";

const HomeSectionMore = () => {
  const { data: news } = useQuery({
    queryKey: ["news", "all"],
    queryFn: async () => {
      const years = vaildNewsYearList();
      const responses = await Promise.all(
        years.map(async (year) => {
          const options = v1Api.getGetApiV1NewsYearQueryOptions(Number(year));
          const response = await options.queryFn({
            queryKey: options.queryKey,
          } as never);

          return normalizeNewsResponse(response.data, year);
        }),
      );

      return responses
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));
    },
  });
  const { data } = v1Api.useGetApiV1Trainings(undefined, {
    query: {
      select: (response) => response.data.trainingLogs,
    },
  });
  const { data: notices } = v1Api.useGetApiV1Notices(undefined, {
    query: {
      select: (response) => response.data.notices ?? [],
    },
  });

  // 날짜순 정렬
  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  return (
    <SheetWrapper>
      <div className="flex flex-col w-full max-w-4xl mx-auto my-16 px-4">
        <Title
          title={"게시글 전체보기"}
          color={Constants.LOGO_BLACK}
          heading={2}
        />
        <div className="flex flex-col gap-6 w-full pt-5">
          {trainings && (
            <MoreCard title="훈련일지" linkTo="/photo" data={trainings} />
          )}
          {news && (
            <MoreCard
              title="지호지"
              linkTo={`/news`}
              //
              data={news.flatMap((item) =>
                item.articles.map((article) => ({
                  ...article,
                  id: `${item.year}/${article.id}`,
                })),
              )}
            />
          )}
          <MoreCard title="공지사항" linkTo="/notice" data={notices || []} />
        </div>
      </div>
    </SheetWrapper>
  );
};

export default HomeSectionMore;
