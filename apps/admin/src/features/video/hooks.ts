import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createHighlightLabel,
  getVideoJobDetail,
  getVideoJobs,
  type CreateVideoLabelBody,
} from "./api";

export const videoKeys = {
  all: ["admin", "videos"] as const,
  list: () => [...videoKeys.all, "list"] as const,
  detail: (jobId: number) => [...videoKeys.all, "detail", jobId] as const,
};

export const useVideoJobs = () => {
  return useQuery({
    queryKey: videoKeys.list(),
    queryFn: getVideoJobs,
    staleTime: 30 * 1000,
  });
};

export const useVideoJobDetail = (jobId: number) => {
  return useQuery({
    queryKey: videoKeys.detail(jobId),
    queryFn: () => getVideoJobDetail(jobId),
    enabled: Number.isFinite(jobId) && jobId > 0,
    staleTime: 30 * 1000,
  });
};

export const useCreateHighlightLabel = (jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      highlightId,
      body,
    }: {
      highlightId: number;
      body: CreateVideoLabelBody;
    }) => createHighlightLabel(highlightId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(jobId) });
    },
  });
};
