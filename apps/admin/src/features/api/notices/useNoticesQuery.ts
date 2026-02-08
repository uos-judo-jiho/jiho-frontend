import { v1Api } from "@packages/api";
import { v1ApiModel } from "@packages/api/model";
import { useMemo } from "react";

const TRANSFORMED_QUERY_KEY = ["notices"] as const;

const mapNoticeResponse = (
  response: unknown,
): v1ApiModel.GetApiV1Notices200NoticesItem[] => {
  if (!response || typeof response !== "object") {
    return [];
  }

  if (
    "notices" in response &&
    Array.isArray((response as Record<string, unknown>).notices)
  ) {
    return (
      (response as { notices: v1ApiModel.GetApiV1Notices200NoticesItem[] })
        .notices ?? []
    );
  }

  return [];
};

export const useNoticesQuery = () => {
  const { queryFn, ...queryOptions } = v1Api.getGetApiV1NoticesQueryOptions();

  const result = v1Api.useGetApiV1Notices(
    undefined,
    { query: queryOptions },
    undefined,
  );

  const notices = useMemo(() => mapNoticeResponse(result.data), [result.data]);

  return {
    ...result,
    data: notices,
    queryKey: TRANSFORMED_QUERY_KEY,
    queryFn,
  };
};
