import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useNewsQuery } from "@/features/api/news/query";
import { useNoticesQuery } from "@/features/api/notices/query";
import { useTrainingListQuery } from "@/features/api/trainings/query";
import { Constants } from "@/shared/lib/constant";
import { useMemo } from "react";
import MoreCard from "./MoreCard";

const HomeSectionMore = () => {
  const { data: news } = useNewsQuery(Constants.LATEST_NEWS_YEAR);
  const { data } = useTrainingListQuery();
  const { data: notices } = useNoticesQuery();

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
              data={news.articles.map((article) => ({
                ...article,
                id: `${news.year}/${article.id}`,
              }))}
            />
          )}
          <MoreCard title="공지사항" linkTo="/notice" data={notices || []} />
        </div>
      </div>
    </SheetWrapper>
  );
};

export default HomeSectionMore;
