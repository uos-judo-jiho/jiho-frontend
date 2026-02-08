import {
  uploadClient,
  UploadProgress,
} from "@/features/api/_internal/upload/client";
import type { AxiosProgressEvent } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UploadState {
  isUploading: boolean;
  uploads: Map<string, UploadProgress>;
  error: string | null;
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

const calculateProgress = (event?: AxiosProgressEvent) => {
  if (!event || typeof event.total !== "number" || event.total === 0) {
    return 0;
  }

  return Math.min(100, Math.round((event.loaded / event.total) * 100));
};

const isAbortError = (error: unknown) => {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "CanceledError"
  ) {
    return true;
  }

  return false;
};

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

  const uploadFile = useCallback(
    async (file: File, folder?: string) => {
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
        fileName: file.name,
        progress: 0,
        status: "uploading",
      });

      try {
        const response = await uploadClient.uploadFile(file, folder, {
          signal: controller.signal,
          onUploadProgress: (event) => {
            updateUpload(uploadId, {
              progress: calculateProgress(event),
              status: "uploading",
            });
          },
        });

        updateUpload(uploadId, {
          status: "completed",
          progress: 100,
          url: response.url,
        });

        if (response.url && onComplete) {
          onComplete(uploadId, response.url);
        }

        return uploadId;
      } catch (error) {
        if (isAbortError(error)) {
          removeUpload(uploadId);
          setState((prev) => ({
            ...prev,
            error: "업로드가 취소되었습니다.",
          }));
          return uploadId;
        }

        const message =
          error instanceof Error
            ? error.message
            : "업로드 중 오류가 발생했습니다.";
        handleUploadError(uploadId, message);
        throw error;
      } finally {
        controllersRef.current.delete(uploadId);
      }
    },
    [handleUploadError, onComplete, removeUpload, updateUpload],
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[], folder?: string) => {
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

      try {
        const response = await uploadClient.uploadMultipleFiles(files, folder, {
          signal: controller.signal,
          onUploadProgress: (event) => {
            updateUpload(uploadId, {
              progress: calculateProgress(event),
              status: "uploading",
            });
          },
        });

        if (!response.success) {
          throw new Error("파일 업로드에 실패했습니다.");
        }

        const firstUrl = response.files?.[0]?.url;

        updateUpload(uploadId, {
          status: "completed",
          progress: 100,
          url: firstUrl,
        });

        if (response.files?.length && onComplete) {
          response.files.forEach((fileResponse) => {
            if (fileResponse.url) {
              onComplete(uploadId, fileResponse.url);
            }
          });
        }

        return uploadId;
      } catch (error) {
        if (isAbortError(error)) {
          removeUpload(uploadId);
          setState((prev) => ({
            ...prev,
            error: "업로드가 취소되었습니다.",
          }));
          return uploadId;
        }

        const message =
          error instanceof Error
            ? error.message
            : "다중 업로드 중 오류가 발생했습니다.";
        handleUploadError(uploadId, message);
        throw error;
      } finally {
        controllersRef.current.delete(uploadId);
      }
    },
    [handleUploadError, onComplete, removeUpload, updateUpload],
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
    return () => {
      controllersRef.current.forEach((controller) => controller.abort());
      controllersRef.current.clear();
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
