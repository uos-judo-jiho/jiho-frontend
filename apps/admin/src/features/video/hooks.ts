import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";

/**
 * 영상 라벨링 데이터는 orval 로 생성된 @packages/api 의 admin 훅을 그대로 사용한다.
 * (업로드/clip 등 file multipart 엔드포인트의 생성 타입은 깨져 있으나, 여기서 쓰는
 *  목록/상세 조회와 라벨 저장은 정상 동작한다.)
 */
export const useVideoJobs = () =>
  v2Admin.useGetApiV2AdminVideos({
    axios: { withCredentials: true },
    query: {
      select: (res) => res.data.jobs,
      staleTime: 30 * 1000,
    },
  });

export const useVideoJobDetail = (jobId: number) =>
  v2Admin.useGetApiV2AdminVideosJobId(jobId, {
    axios: { withCredentials: true },
    query: {
      enabled: Number.isFinite(jobId) && jobId > 0,
      select: (res) => res.data.job,
      staleTime: 30 * 1000,
    },
  });

export const useCreateHighlightLabel = (jobId: number) => {
  const queryClient = useQueryClient();

  return v2Admin.usePostApiV2AdminHighlightsHighlightIdLabel({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: v2Admin.getGetApiV2AdminVideosJobIdQueryKey(jobId),
        }),
    },
  });
};
