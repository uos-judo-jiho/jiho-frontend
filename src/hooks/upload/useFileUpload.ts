import { useState, useCallback, useRef, useEffect } from "react";
import { uploadClient, UploadProgress, UploadStartResponse } from "@/api/_internal/upload/client";

export interface UploadState {
  isUploading: boolean;
  uploads: Map<string, UploadProgress>;
  error: string | null;
}

export const useFileUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    uploads: new Map(),
    error: null,
  });

  const eventSourcesRef = useRef<Map<string, EventSource>>(new Map());

  const updateUpload = useCallback(
    (uploadId: string, progress: Partial<UploadProgress>) => {
      setState((prev) => {
        const newUploads = new Map(prev.uploads);
        const existing = newUploads.get(uploadId);
        newUploads.set(uploadId, {
          ...existing,
          ...progress,
        } as UploadProgress);

        return {
          ...prev,
          uploads: newUploads,
        };
      });
    },
    []
  );

  const startProgressTracking = useCallback(
    (uploadId: string, sseToken: string) => {
      const eventSource = uploadClient.createUploadEventSource(uploadId, sseToken);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "connected":
              console.log("Upload progress tracking connected:", data.uploadId);
              break;

            case "progress":
              updateUpload(uploadId, {
                uploadId: data.uploadId,
                fileName: data.fileName,
                progress: data.progress,
                status: data.status,
                url: data.url,
                error: data.error,
              });

              // 완료되거나 에러가 발생한 경우 EventSource 정리
              if (data.status === "completed" || data.status === "error") {
                eventSource.close();
                eventSourcesRef.current.delete(uploadId);

                setState((prev) => ({
                  ...prev,
                  isUploading:
                    prev.uploads.size > 1 ||
                    Array.from(prev.uploads.values()).some(
                      (u) => u.status === "uploading"
                    ),
                }));
              }
              break;

            case "close":
            case "timeout":
              eventSource.close();
              eventSourcesRef.current.delete(uploadId);
              break;
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
        eventSourcesRef.current.delete(uploadId);

        updateUpload(uploadId, {
          status: "error",
          error: "업로드 상태 추적 연결이 끊어졌습니다.",
        });
      };

      eventSourcesRef.current.set(uploadId, eventSource);
    },
    [updateUpload]
  );

  const uploadFile = useCallback(
    async (file: File, folder?: string) => {
      try {
        setState((prev) => ({
          ...prev,
          isUploading: true,
          error: null,
        }));

        const response: UploadStartResponse = await uploadClient.uploadFile(file, folder);

        // 초기 업로드 상태 설정
        updateUpload(response.uploadId, {
          uploadId: response.uploadId,
          fileName: file.name,
          progress: 0,
          status: "uploading",
        });

        // 진행 상황 추적 시작 (임시 토큰 사용)
        startProgressTracking(response.uploadId, response.sseToken);

        return response.uploadId;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isUploading: false,
          error:
            error instanceof Error
              ? error.message
              : "업로드 중 오류가 발생했습니다.",
        }));
        throw error;
      }
    },
    [updateUpload, startProgressTracking]
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[], folder?: string) => {
      try {
        setState((prev) => ({
          ...prev,
          isUploading: true,
          error: null,
        }));

        const response: UploadStartResponse = await uploadClient.uploadMultipleFiles(
          files,
          folder
        );

        // 초기 업로드 상태 설정
        updateUpload(response.uploadId, {
          uploadId: response.uploadId,
          fileName: `${files.length}개 파일`,
          progress: 0,
          status: "uploading",
        });

        // 진행 상황 추적 시작 (임시 토큰 사용)
        startProgressTracking(response.uploadId, response.sseToken);

        return response.uploadId;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isUploading: false,
          error:
            error instanceof Error
              ? error.message
              : "다중 업로드 중 오류가 발생했습니다.",
        }));
        throw error;
      }
    },
    [updateUpload, startProgressTracking]
  );

  const cancelUpload = useCallback(async (uploadId: string) => {
    try {
      // EventSource 정리
      const eventSource = eventSourcesRef.current.get(uploadId);
      if (eventSource) {
        eventSource.close();
        eventSourcesRef.current.delete(uploadId);
      }

      // 서버에 취소 요청
      await uploadClient.cancelUpload(uploadId);

      // 로컬 상태에서 제거
      setState((prev) => {
        const newUploads = new Map(prev.uploads);
        newUploads.delete(uploadId);

        return {
          ...prev,
          uploads: newUploads,
          isUploading:
            newUploads.size > 0 &&
            Array.from(newUploads.values()).some(
              (u) => u.status === "uploading"
            ),
        };
      });
    } catch (error) {
      console.error("Upload cancellation error:", error);
    }
  }, []);

  const clearCompleted = useCallback(() => {
    setState((prev) => {
      const newUploads = new Map();

      for (const [uploadId, upload] of prev.uploads) {
        if (upload.status === "uploading") {
          newUploads.set(uploadId, upload);
        }
      }

      return {
        ...prev,
        uploads: newUploads,
      };
    });
  }, []);

  const getUploadByStatus = useCallback(
    (status: UploadProgress["status"]) => {
      return Array.from(state.uploads.values()).filter(
        (upload) => upload.status === status
      );
    },
    [state.uploads]
  );

  // 컴포넌트 언마운트 시 모든 EventSource 정리
  useEffect(() => {
    const eventSources = eventSourcesRef.current;
    return () => {
      eventSources.forEach((eventSource) => {
        eventSource.close();
      });
      eventSources.clear();
    };
  }, []);

  return {
    ...state,
    uploadFile,
    uploadMultipleFiles,
    cancelUpload,
    clearCompleted,
    getUploadByStatus,
    uploadsArray: Array.from(state.uploads.values()),
    completedUploads: Array.from(state.uploads.values()).filter(
      (u) => u.status === "completed"
    ),
    failedUploads: Array.from(state.uploads.values()).filter(
      (u) => u.status === "error"
    ),
    uploadingCount: Array.from(state.uploads.values()).filter(
      (u) => u.status === "uploading"
    ).length,
  };
};
