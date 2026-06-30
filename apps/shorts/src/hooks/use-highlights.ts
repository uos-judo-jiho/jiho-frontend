import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  createHighlightLabel,
  getVideoEvents,
  getVideoJobDetail,
  getVideoJobs,
  type CreateLabelBody,
  type VideoHighlight,
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
