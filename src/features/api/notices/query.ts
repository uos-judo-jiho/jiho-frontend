import { useQuery } from "@tanstack/react-query";
import { getNotices } from "./client";

export const useNoticesQuery = () => {
  return useQuery({
    queryKey: ["notices"],
    queryFn: getNotices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
