import { LazyImage } from "@/components/common/image/lazy-image";
import { Card } from "@/components/ui/card";
import { v2Api } from "@packages/api";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const ExerciseThumbnail = () => {
  const { data } = v2Api.useGetApiV2Trainings(undefined, {
    query: {
      select: (response) => response.data.trainingLogs,
    },
  });

  // 날짜순 정렬 후 첫 번째 항목
  const lastTraningData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort((a, b) =>
      b.dateTime.localeCompare(a.dateTime),
    );
    return sorted[0];
  }, [data]);

  if (!lastTraningData) return null;

  return (
    <Card className="max-w-[640px] w-full sm:w-full mx-auto relative p-0 rounded-xl border-none group overflow-hidden">
      <Link to={`/photo/${lastTraningData.id}`} className="rounded-xl">
        <div className="w-full rounded-inherit relative">
          <LazyImage
            src={lastTraningData.images[0].originSrc}
            lowResSrc={lastTraningData.images[0].smallSrc ?? undefined}
            alt={`훈련 일지 - ${lastTraningData.dateTime}`}
            className="w-full h-full rounded-inherit brightness-50"
          />
          <div
            className="absolute flex group-hover:flex justify-center items-center top-0 bottom-0 left-0 right-0 z-10"
            style={{ color: "var(--theme-bg)" }}
          >
            <div className="flex flex-col items-normal justify-normal">
              <span
                className="mb-1"
                style={{ fontSize: "var(--theme-font-description)" }}
              >
                훈련 일지
              </span>
              <span
                className="mb-1"
                style={{ fontSize: "var(--theme-font-description)" }}
              >
                {lastTraningData.dateTime}
              </span>
              <span style={{ fontSize: "1.2rem" }}>자세히 보기</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ExerciseThumbnail;
