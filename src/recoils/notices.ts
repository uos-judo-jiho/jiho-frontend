import { useNoticesQuery } from "@/api/notices/query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useNotices = () => {
  const queryClient = useQueryClient();
  const { data: notices = [], refetch } = useNoticesQuery();

  const fetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const refreshNotice = useCallback(async () => {
    // 캐시 무효화 후 다시 가져오기
    await queryClient.invalidateQueries({ queryKey: ["notices"] });
  }, [queryClient]);

  return { fetch, refreshNotice, notices };
};
