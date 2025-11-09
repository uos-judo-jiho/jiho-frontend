import { Card } from "@/components/ui/card";
import { useTrainingListQuery } from "@/api/trainings/query";
import { Link } from "react-router-dom";
import Col from "@/components/layouts/Col";
import { useMemo } from "react";

const ExerciseThumbnail = () => {
  const { data } = useTrainingListQuery();

  // 날짜순 정렬 후 첫 번째 항목
  const lastTraningData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort((a, b) =>
      b.dateTime.localeCompare(a.dateTime)
    );
    return sorted[0];
  }, [data]);

  if (!lastTraningData) return null;

  return (
    <Card className="max-w-[640px] w-full sm:w-full mx-auto relative p-0 rounded-xl border-none group">
      <Link to={`/photo/${lastTraningData.id}`} className="rounded-xl">
        <div className="w-full rounded-inherit relative">
          <img
            src={lastTraningData.imgSrcs[0]}
            alt={`훈련 일지 - ${lastTraningData.dateTime}`}
            className="w-full h-full rounded-inherit group-hover:brightness-50 sm:brightness-50"
          />
          <div
            className="absolute hidden sm:flex group-hover:flex justify-center items-center top-0 bottom-0 left-0 right-0"
            style={{ color: "var(--theme-bg)" }}
          >
            <Col justifyContent="center" alignItems="center">
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
            </Col>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ExerciseThumbnail;
