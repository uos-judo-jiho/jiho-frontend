import { useTrainingListQuery } from "@/api/trainings/query";
import { Constants } from "@/lib/constant";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useNews } from "@/recoils/news";
import { useNoticesQuery } from "@/api/notices/query";
import MoreCard from "./MoreCard";
import { useMemo } from "react";

const HomeSectionMore = () => {
  const { news } = useNews();
  const { data } = useTrainingListQuery();
  const { data: notices } = useNoticesQuery();

  // 날짜순 정렬
  const trainings = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [data]);

  return (
    <SheetWrapper>
      <div>
        <Title
          title={"게시글 전체보기"}
          color={Constants.LOGO_BLACK}
          heading={2}
        />
        <div className="flex flex-col gap-6 w-full pt-5">
          <MoreCard title="훈련일지" linkTo="/photo" data={trainings || []} />
          <MoreCard
            title="지호지"
            linkTo={`/news/${Constants.LATEST_NEWS_YEAR}`}
            data={news[0]?.articles || []}
          />
          <MoreCard title="공지사항" linkTo="/notice" data={notices || []} />
        </div>
      </div>
    </SheetWrapper>
  );
};

export default HomeSectionMore;
