import { UploadProgress as UploadProgressType } from "@/features/api/_internal/upload/client";
import { cn } from "@/shared/lib/utils";
import { useEffect, useRef, useState } from "react";

interface UploadProgressProps {
  uploads: UploadProgressType[];
  onCancel: (uploadId: string) => void;
  clearUploads: () => void;
}

const getStatusBadgeColor = (status: UploadProgressType["status"]) => {
  switch (status) {
    case "uploading":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const UploadProgress = ({
  uploads,
  onCancel,
  clearUploads,
}: UploadProgressProps) => {
  const [closeUploadProgress, setCloseUploadProgress] = useState(false);

  const prevUploadId = useRef(uploads.at(-1)?.uploadId || null);

  const handleClose = () => {
    setCloseUploadProgress(true);
    clearUploads();
  };

  useEffect(() => {
    if (
      prevUploadId.current !== uploads.at(-1)?.uploadId &&
      uploads.length > 0
    ) {
      setCloseUploadProgress(false);
    }

    prevUploadId.current = uploads.at(-1)?.uploadId || null;
  }, [uploads, uploads.length]);

  if (uploads.length === 0) return null;

  if (closeUploadProgress) return null;

  return (
    <div className="relative group">
      <button
        onClick={handleClose}
        className={cn(
          "close-icon-button opacity-0 group-hover:opacity-100 transition-opacity duration-[237ms] ease-in-out",
          "absolute top-[-4px] right-[-12px]",
          "bg-white rounded-full m-2 text-gray-500 hover:text-gray-800"
        )}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="11"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M15 9L9 15M9 9L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {uploads.map((upload) => (
        <div
          key={upload.uploadId}
          className="my-2.5 p-4 border border-gray-300 rounded-lg bg-gray-50"
        >
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-medium text-gray-800">{upload.fileName}</span>
            <div className="flex gap-2 items-center">
              <span
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium text-white",
                  getStatusBadgeColor(upload.status)
                )}
              >
                {upload.status === "uploading" && "업로드 중"}
                {upload.status === "completed" && "완료"}
                {upload.status === "error" && "실패"}
              </span>
              {upload.status === "uploading" && (
                <button
                  onClick={() => onCancel(upload.uploadId)}
                  className="bg-red-400 hover:bg-red-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer"
                >
                  취소
                </button>
              )}
            </div>
          </div>

          <div className="w-full h-2 bg-gray-300 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-[width] duration-300 ease-in-out"
              style={{ width: `${upload.progress}%` }}
            />
          </div>

          {upload.error && (
            <div className="text-red-500 text-xs mt-1.5">{upload.error}</div>
          )}

          {upload.status === "completed" && upload.url && (
            <div className="text-xs text-gray-600 mt-1.5">
              업로드 완료: {upload.url}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
