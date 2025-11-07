import { useMemo } from "react";
import { useTrainingListQuery } from "@/api/trainings/query";

export const useTrainings = (year?: string) => {
  const { data, isLoading, refetch } = useTrainingListQuery(year);

  // 날짜순 정렬된 데이터 반환
  const trainings = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) =>
      b.dateTime.localeCompare(a.dateTime)
    );
  }, [data]);

  return { trainings, isLoading, refetch };
};
