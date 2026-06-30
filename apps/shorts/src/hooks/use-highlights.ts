import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import {
  createHighlightLabel,
  getVideoEvents,
  getVideoJobDetail,
  getVideoJobs,
  type CreateLabelBody,
  type VideoHighlight,
  type VideoJobListItem,
} from "@/api/video";

export const useVideoJobs = () =>
  useQuery({
    queryKey: ["videoJobs"],
    queryFn: getVideoJobs,
    staleTime: 30 * 1000,
    select: (jobs) =>
      jobs
        .filter((job) => job.status === "done" && job.highlightCount > 0)
        .sort((a, b) => a.id - b.id),
  });

export const useVideoHighlights = (jobId: number): {
  highlights: VideoHighlight[];
  isLoading: boolean;
  isError: boolean;
} => {
  const detailQuery = useQuery({
    queryKey: ["videoJobDetail", jobId],
    queryFn: () => getVideoJobDetail(jobId),
    staleTime: 30 * 1000,
    enabled: jobId > 0,
  });

  const eventsQuery = useQuery({
    queryKey: ["videoEvents", jobId],
    queryFn: () => getVideoEvents(jobId),
    staleTime: 30 * 1000,
    enabled: jobId > 0,
  });

  const highlights = useMemo<VideoHighlight[]>(() => {
    if (!detailQuery.data || !eventsQuery.data) return [];
    const eventMap = new Map(
      eventsQuery.data.map((e) => [e.highlightId, e.isLabeledByCurrentUser]),
    );
    return detailQuery.data.highlights.map((h) => ({
      ...h,
      isLabeledByCurrentUser: eventMap.get(h.id) ?? false,
    }));
  }, [detailQuery.data, eventsQuery.data]);

  return {
    highlights,
    isLoading: detailQuery.isLoading || eventsQuery.isLoading,
    isError: detailQuery.isError || eventsQuery.isError,
  };
};

/**
 * 현재 하이라이트가 마지막 N개 안에 들어오면 다음 job의 상세 + 이벤트를
 * 미리 prefetch해서 스와이프 전환 시 로딩 없이 바로 보이도록 한다.
 */
const PREFETCH_AHEAD = 2;

export const useNextJobPrefetch = (
  jobs: VideoJobListItem[],
  jobIndex: number,
  highlightIndex: number,
  totalHighlights: number,
) => {
  const queryClient = useQueryClient();
  const nextJob = jobs[jobIndex + 1];

  useEffect(() => {
    if (!nextJob) return;
    const remainingAfterCurrent = totalHighlights - highlightIndex - 1;
    if (remainingAfterCurrent > PREFETCH_AHEAD) return;

    void queryClient.prefetchQuery({
      queryKey: ["videoJobDetail", nextJob.id],
      queryFn: () => getVideoJobDetail(nextJob.id),
      staleTime: 30 * 1000,
    });
    void queryClient.prefetchQuery({
      queryKey: ["videoEvents", nextJob.id],
      queryFn: () => getVideoEvents(nextJob.id),
      staleTime: 30 * 1000,
    });
  }, [nextJob, highlightIndex, totalHighlights, queryClient]);
};

export const useCreateLabel = (jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      highlightId,
      data,
    }: {
      highlightId: number;
      data: CreateLabelBody;
    }) => createHighlightLabel(highlightId, data),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["videoEvents", jobId] }),
        queryClient.invalidateQueries({ queryKey: ["videoJobDetail", jobId] }),
      ]),
  });
};
