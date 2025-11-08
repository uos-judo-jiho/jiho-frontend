import { UploadProgress as UploadProgressType } from "@/api/_internal/upload/client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const UploadProgressContainer = styled.div`
  position: relative;

  &:hover .close-icon-button {
    opacity: 1;
    transition: opacity 237ms ease;
  }
`;

const ProgressContainer = styled.div`
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FileName = styled.span`
  font-weight: 500;
  color: #333;
`;

const StatusBadge = styled.span<{ status: UploadProgressType["status"] }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case "uploading":
        return "#2196F3";
      case "completed":
        return "#4CAF50";
      case "error":
        return "#F44336";
      default:
        return "#999";
    }
  }};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #2196f3;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
`;

const CancelButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #ff5252;
  }
`;

interface UploadProgressProps {
  uploads: UploadProgressType[];
  onCancel: (uploadId: string) => void;
  clearUploads: () => void;
}

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
    <UploadProgressContainer className="relative ">
      <button
        onClick={handleClose}
        className={cn(
          "close-icon-button opacity-0",
          "absolute top-[-4px] right-[-12px]",
          "bg-white border-radius-50 m-2 text-gray-500 hover:text-gray-800"
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
        <ProgressContainer key={upload.uploadId}>
          <ProgressHeader>
            <FileName>{upload.fileName}</FileName>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <StatusBadge status={upload.status}>
                {upload.status === "uploading" && "업로드 중"}
                {upload.status === "completed" && "완료"}
                {upload.status === "error" && "실패"}
              </StatusBadge>
              {upload.status === "uploading" && (
                <CancelButton onClick={() => onCancel(upload.uploadId)}>
                  취소
                </CancelButton>
              )}
            </div>
          </ProgressHeader>

          <ProgressBar>
            <ProgressFill progress={upload.progress} />
          </ProgressBar>

          {upload.error && <ErrorMessage>{upload.error}</ErrorMessage>}

          {upload.status === "completed" && upload.url && (
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              업로드 완료: {upload.url}
            </div>
          )}
        </ProgressContainer>
      ))}
    </UploadProgressContainer>
  );
};
