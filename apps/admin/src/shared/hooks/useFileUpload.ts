import { v2Admin } from "@packages/api";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UploadState {
  isUploading: boolean;
  uploads: Map<string, UploadProgress>;
  error: string | null;
}

export interface UploadProgress {
  uploadId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  error?: string;
}

export interface UseFileUploadOptions {
  onComplete?: (uploadId: string, url: string) => void;
  onError?: (uploadId: string, error: string) => void;
}

const hasActiveUploads = (uploads: Map<string, UploadProgress>) => {
  return Array.from(uploads.values()).some(
    (upload) => upload.status === "uploading",
  );
};

const generateUploadId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// orval의 usePostApiV2AdminImage 쿼리 훅을 활용한 업로드
const useImageUploadMutation = () =>
  v2Admin.usePostApiV2AdminImage({
    axios: {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const { onComplete, onError } = options || {};
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    uploads: new Map(),
    error: null,
  });

  const controllersRef = useRef<Map<string, AbortController>>(new Map());

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
          isUploading: hasActiveUploads(newUploads),
        };
      });
    },
    [],
  );

  const removeUpload = useCallback((uploadId: string) => {
    setState((prev) => {
      const newUploads = new Map(prev.uploads);
      newUploads.delete(uploadId);

      return {
        ...prev,
        uploads: newUploads,
        isUploading: hasActiveUploads(newUploads),
      };
    });
  }, []);

  const handleUploadError = useCallback(
    (uploadId: string, message: string) => {
      updateUpload(uploadId, {
        status: "error",
        error: message,
      });

      setState((prev) => ({
        ...prev,
        error: message,
      }));

      if (onError) {
        onError(uploadId, message);
      }
    },
    [onError, updateUpload],
  );

  const imageUploadMutation = useImageUploadMutation();

  const uploadFile = useCallback(
    async (file: File, _folder?: string) => {
      const uploadId = generateUploadId();
      setState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
      }));

      updateUpload(uploadId, {
        uploadId,
        fileName: file.name,
        progress: 0,
        status: "uploading",
      });

      return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        imageUploadMutation.mutate(
          {
            data: { file },
          },
          {
            onSuccess: (response: any) => {
              updateUpload(uploadId, {
                status: "completed",
                progress: 100,
                url: response?.data?.url,
              });
              if (response?.data?.url && onComplete) {
                onComplete(uploadId, response.data.url);
              }
              resolve(uploadId);
            },
            onError: (error: any) => {
              handleUploadError(
                uploadId,
                error?.message || "업로드 중 오류가 발생했습니다.",
              );
              reject(error);
            },
          },
        );
      });
    },
    [handleUploadError, onComplete, updateUpload, imageUploadMutation],
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[], _folder?: string) => {
      const uploadId = generateUploadId();
      const controller = new AbortController();
      controllersRef.current.set(uploadId, controller);

      setState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
      }));

      updateUpload(uploadId, {
        uploadId,
        fileName: `${files.length}개 파일`,
        progress: 0,
        status: "uploading",
      });

      if (files.length === 0) {
        handleUploadError(uploadId, "업로드할 파일이 없습니다.");
        controllersRef.current.delete(uploadId);
        return uploadId;
      }

      let completedCount = 0;
      let lastUrl: string | undefined;
      const totalCount = files.length;

      await Promise.all(
        files.map(
          (file) =>
            new Promise<void>((resolve) => {
              const formData = new FormData();
              formData.append("file", file);
              imageUploadMutation.mutate(
                { data: { file } },
                {
                  onSuccess: (response: any) => {
                    completedCount += 1;
                    const url = response?.data?.url;
                    lastUrl = url ?? lastUrl;

                    updateUpload(uploadId, {
                      progress: Math.round((completedCount / totalCount) * 100),
                      status: "uploading",
                    });

                    if (url && onComplete) {
                      onComplete(uploadId, url);
                    }
                    resolve();
                  },
                  onError: (error: any) => {
                    handleUploadError(
                      uploadId,
                      error?.message || "업로드 중 오류가 발생했습니다.",
                    );
                    resolve();
                  },
                },
              );
            }),
        ),
      );

      updateUpload(uploadId, {
        status: "completed",
        progress: 100,
        url: lastUrl,
      });

      controllersRef.current.delete(uploadId);
      return uploadId;
    },
    [handleUploadError, onComplete, updateUpload, imageUploadMutation],
  );

  const cancelUpload = useCallback(
    (uploadId: string) => {
      const controller = controllersRef.current.get(uploadId);
      if (controller) {
        controller.abort();
        controllersRef.current.delete(uploadId);
        return;
      }

      removeUpload(uploadId);
    },
    [removeUpload],
  );

  const clearCompleted = useCallback(() => {
    setState((prev) => {
      const newUploads = new Map<string, UploadProgress>();

      for (const [uploadId, upload] of prev.uploads) {
        if (upload.status === "uploading") {
          newUploads.set(uploadId, upload);
        }
      }

      return {
        ...prev,
        uploads: newUploads,
        isUploading: hasActiveUploads(newUploads),
      };
    });
  }, []);

  const getUploadByStatus = useCallback(
    (status: UploadProgress["status"]) => {
      return Array.from(state.uploads.values()).filter(
        (upload) => upload.status === status,
      );
    },
    [state.uploads],
  );

  useEffect(() => {
    const controllers = controllersRef.current;
    return () => {
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
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
      (u) => u.status === "completed",
    ),
    failedUploads: Array.from(state.uploads.values()).filter(
      (u) => u.status === "error",
    ),
    uploadingCount: Array.from(state.uploads.values()).filter(
      (u) => u.status === "uploading",
    ).length,
  };
};
