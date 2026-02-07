import { getGetTrainingQueryOptions, useGetTraining } from "@uos-judo/api";
import { BoardResponseDto } from "@uos-judo/api/model";
import { useMemo } from "react";

type TrainingFilters = {
  year?: number | "all";
};

const TRANSFORMED_QUERY_KEY = ["trainings"] as const;

const mapTrainingResponse = (
  response: unknown,
  year?: number | "all",
): BoardResponseDto[] => {
  if (!response || typeof response !== "object") {
    return [];
  }

  if (
    year === "all" ||
    (typeof year === "undefined" &&
      Array.isArray((response as any).trainingLogs))
  ) {
    return (
      (response as { trainingLogs?: BoardResponseDto[] }).trainingLogs ?? []
    );
  }

  if (typeof year === "number") {
    const yearKey = String(year);
    if (yearKey in (response as Record<string, BoardResponseDto[]>)) {
      return (response as Record<string, BoardResponseDto[]>)[yearKey] ?? [];
    }
  }

  return [];
};

export const useTrainingsQuery = ({ year = "all" }: TrainingFilters = {}) => {
  const params = year === "all" ? undefined : { year: Number(year) };
  const { queryFn, ...queryOptions } = getGetTrainingQueryOptions(params);

  const result = useGetTraining(params, { query: queryOptions });

  const trainings = useMemo(
    () => mapTrainingResponse(result.data, year),
    [result.data, year],
  );

  return {
    ...result,
    data: trainings,
    queryKey: [...TRANSFORMED_QUERY_KEY, year],
    queryFn,
  };
};
