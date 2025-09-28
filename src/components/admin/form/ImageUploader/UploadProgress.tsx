import React from "react";
import styled from "styled-components";
import { UploadProgress as UploadProgressType } from "@/api/_internal/upload/client";

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

const StatusBadge = styled.span<{ status: UploadProgressType['status'] }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case 'uploading':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      default:
        return '#999';
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
  background-color: #2196F3;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #F44336;
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
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ uploads, onCancel }) => {
  if (uploads.length === 0) return null;

  return (
    <div>
      {uploads.map((upload) => (
        <ProgressContainer key={upload.uploadId}>
          <ProgressHeader>
            <FileName>{upload.fileName}</FileName>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <StatusBadge status={upload.status}>
                {upload.status === 'uploading' && '업로드 중'}
                {upload.status === 'completed' && '완료'}
                {upload.status === 'error' && '실패'}
              </StatusBadge>
              {upload.status === 'uploading' && (
                <CancelButton onClick={() => onCancel(upload.uploadId)}>
                  취소
                </CancelButton>
              )}
            </div>
          </ProgressHeader>

          <ProgressBar>
            <ProgressFill progress={upload.progress} />
          </ProgressBar>

          {upload.error && (
            <ErrorMessage>{upload.error}</ErrorMessage>
          )}

          {upload.status === 'completed' && upload.url && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              업로드 완료: {upload.url}
            </div>
          )}
        </ProgressContainer>
      ))}
    </div>
  );
};