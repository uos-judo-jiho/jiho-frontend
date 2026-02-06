import { useMemo } from "react";
import { getGetNoticeQueryOptions, useGetNotice } from "@/shared/api/_generated";
import { BoardResponseDto } from "@/shared/api/_generated/model";

const TRANSFORMED_QUERY_KEY = ["notices"] as const;

const mapNoticeResponse = (response: unknown): BoardResponseDto[] => {
  if (!response || typeof response !== "object") {
    return [];
  }

  if (
    "notices" in response &&
    Array.isArray((response as Record<string, unknown>).notices)
  ) {
    return (response as { notices: BoardResponseDto[] }).notices ?? [];
  }

  return [];
};

export const useNoticesQuery = () => {
  const { queryFn, ...queryOptions } = getGetNoticeQueryOptions();

  const result = useGetNotice(
    undefined,
    { query: queryOptions },
    undefined
  );

  const notices = useMemo(() => mapNoticeResponse(result.data), [result.data]);

  return {
    ...result,
    data: notices,
    queryKey: TRANSFORMED_QUERY_KEY,
    queryFn,
  };
};
