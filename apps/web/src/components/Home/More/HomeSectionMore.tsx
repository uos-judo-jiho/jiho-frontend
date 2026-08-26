import SheetWrapper from "@/components/layouts/SheetWrapper";
import Title from "@/components/layouts/Title";
import { useLatestNews } from "@/features/seo/news/hooks/use-latest-news";
import { Constants } from "@/shared/lib/constant";
import { v2Api } from "@packages/api";
import { linkOptions } from "@tanstack/react-router";
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
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
        <Title
          title={"게시글 전체보기"}
          color={Constants.LOGO_BLACK}
          heading={2}
        />
        <div className="flex flex-col gap-2 w-full pt-5 md:gap-6">
          <MoreCard
            title="훈련일지"
            moreLink={linkOptions({ to: "/photo" })}
            getItemLink={(item) =>
              linkOptions({ to: "/photo/$id", params: { id: String(item.id) } })
            }
            data={trainings}
          />
          <MoreCard
            title="지호지"
            moreLink={linkOptions({ to: "/news" })}
            getItemLink={(item) =>
              linkOptions({
                to: "/news/$id/$newsId",
                params: {
                  id: String(
                    new Date(item.dateTime ?? Date.now()).getFullYear(),
                  ),
                  newsId: String(item.id),
                },
              })
            }
            data={news}
          />
          <MoreCard
            title="공지사항"
            moreLink={linkOptions({ to: "/notice" })}
            getItemLink={(item) =>
              linkOptions({
                to: "/notice/$id",
                params: { id: String(item.id) },
              })
            }
            data={notices}
          />
        </div>
      </div>
    </SheetWrapper>
  );
};

export default HomeSectionMore;
