import { useQuery } from "@tanstack/react-query";
import { getTrainings } from "../training";

/**
 *
 * @param year 2023, 2024, 2025, ... or 'all'
 * @returns
 */
export const useTrainingListQuery = (year: string = "all") => {
  return useQuery({
    queryKey: ["trainings", year],
    queryFn: () => {
      if (year === "all") {
        return getTrainings();
      }
      return getTrainings(year);
    },
  });
};
