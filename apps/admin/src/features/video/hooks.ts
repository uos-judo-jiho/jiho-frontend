import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";

/**
 * 영상 라벨링 데이터는 orval 로 생성된 @packages/api 의 admin 훅을 그대로 사용한다.
 * (업로드/clip 등 file multipart 엔드포인트의 생성 타입은 깨져 있으나, 여기서 쓰는
 *  목록/상세 조회와 라벨 저장은 정상 동작한다.)
 */
export const useVideoJobs = () =>
  v2Admin.useListVideoJobs({
    axios: { withCredentials: true },
    query: {
      select: (res) => res.data.jobs,
      staleTime: 30 * 1000,
    },
  });

export const useVideoJobDetail = (jobId: number) =>
  v2Admin.useGetVideoJob(jobId, {
    axios: { withCredentials: true },
    query: {
      enabled: Number.isFinite(jobId) && jobId > 0,
      select: (res) => res.data.job,
      staleTime: 30 * 1000,
    },
  });

export const useVideoEvents = (jobId: number) =>
  v2Admin.useListVideoJobEvents(jobId, {
    axios: { withCredentials: true },
    query: {
      enabled: Number.isFinite(jobId) && jobId > 0,
      select: (res) => res.data.events,
      staleTime: 30 * 1000,
    },
  });

/** 영상/하이라이트 삭제는 root 권한에서만 허용된다(서버 게이팅과 일치). */
export const useIsRoot = (): boolean => {
  const { data } = v2Admin.useGetMyProfile({
    axios: { withCredentials: true },
    query: { retry: false, select: (res) => res.data.user.role === "root" },
  });
  return data ?? false;
};

export const useDeleteVideoJob = () => {
  const queryClient = useQueryClient();

  return v2Admin.useDeleteVideoJob({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: v2Admin.getListVideoJobsQueryKey(),
        }),
    },
  });
};

export const useDeleteHighlight = (jobId: number) => {
  const queryClient = useQueryClient();

  return v2Admin.useDeleteHighlight({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: v2Admin.getGetVideoJobQueryKey(jobId),
          }),
          queryClient.invalidateQueries({
            queryKey: v2Admin.getListVideoJobEventsQueryKey(jobId),
          }),
        ]),
    },
  });
};

export const useCreateHighlightLabel = (jobId: number) => {
  const queryClient = useQueryClient();

  return v2Admin.useCreateHighlightLabel({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: v2Admin.getListVideoJobEventsQueryKey(jobId),
          }),
          queryClient.invalidateQueries({
            queryKey: v2Admin.getGetVideoJobQueryKey(jobId),
          }),
        ]);
      },
    },
  });
};
