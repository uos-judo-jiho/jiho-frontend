import { v1Api } from "@packages/api";
import { v1ApiModel } from "@packages/api/model";
import { useMemo } from "react";

type TrainingFilters = {
  year?: number | "all";
};

const TRANSFORMED_QUERY_KEY = ["trainings"] as const;

const mapTrainingResponse = (
  response: unknown,
): v1ApiModel.GetApiV1Trainings200TrainingLogsItem[] => {
  if (!response || typeof response !== "object") {
    return [];
  }

  if ("trainingLogs" in response) {
    return (
      (
        response as {
          trainingLogs?: v1ApiModel.GetApiV1Trainings200TrainingLogsItem[];
        }
      ).trainingLogs ?? []
    );
  }

  return [];
};

export const useTrainingsQuery = ({ year = "all" }: TrainingFilters = {}) => {
  const params = year === "all" ? undefined : { year: Number(year) };
  const { queryFn, ...queryOptions } =
    v1Api.getGetApiV1TrainingsQueryOptions(params);

  const result = v1Api.useGetApiV1Trainings(params, { query: queryOptions });

  const trainings = useMemo(
    () => mapTrainingResponse(result.data),
    [result.data],
  );

  return {
    ...result,
    data: trainings,
    queryKey: [...TRANSFORMED_QUERY_KEY, year],
    queryFn,
  };
};
