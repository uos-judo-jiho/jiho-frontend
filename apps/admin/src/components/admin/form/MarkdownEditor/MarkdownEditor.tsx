import { HelpMarkdown } from "@/components/admin/form/Help/HelpMarkdown";
import { useFileUpload } from "@/shared/hooks/useFileUpload";
import { cn } from "@/shared/lib/utils";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

type EditorMode = "edit" | "preview" | "live";

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "마크다운으로 내용을 작성하세요...\n\n# 제목\n\n**굵은 글씨**와 *기울임꼴*을 사용할 수 있습니다.\n\n- 리스트 항목 1\n- 리스트 항목 2\n\n```javascript\n// 코드 블록도 지원됩니다\nconsole.log('Hello, World!');\n```\n\n> 인용구도 사용 가능해요.\n\n[링크](https://example.com)와 이미지도 추가할 수 있습니다.",
}) => {
  const [mode, setMode] = useState<EditorMode>("live");
  const [internalValue, setInternalValue] = useState(value);
  const [isDragOver, setIsDragOver] = useState(false);
  const { uploadFile, uploadsArray } = useFileUpload();
  const uploadingPlaceholdersRef = useRef<Map<string, string>>(new Map());

  // value prop이 변경될 때 내부 상태 동기화
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // 업로드 완료된 이미지들을 마크다운에 반영
  useEffect(() => {
    uploadsArray.forEach((upload) => {
      if (upload.status === "completed" && upload.url) {
        const placeholder = uploadingPlaceholdersRef.current.get(
          upload.uploadId,
        );
        if (placeholder) {
          // 업로드 중 플레이스홀더를 실제 이미지로 교체
          const imageMarkdown = `![Image](${upload.url})`;
          const updatedValue = internalValue.replace(
            placeholder,
            imageMarkdown,
          );

          setInternalValue(updatedValue);
          onChange(updatedValue);

          // 플레이스홀더 제거
          uploadingPlaceholdersRef.current.delete(upload.uploadId);
        }
      } else if (upload.status === "error") {
        const placeholder = uploadingPlaceholdersRef.current.get(
          upload.uploadId,
        );
        if (placeholder) {
          // 에러 시 플레이스홀더를 에러 메시지로 교체
          const errorMessage = `![Upload failed: ${
            upload.error || "Unknown error"
          }]()`;
          const updatedValue = internalValue.replace(placeholder, errorMessage);

          setInternalValue(updatedValue);
          onChange(updatedValue);

          // 플레이스홀더 제거
          uploadingPlaceholdersRef.current.delete(upload.uploadId);
        }
      }
    });
  }, [uploadsArray, internalValue, onChange]);

  const handleChange = (val?: string) => {
    const newValue = val || "";
    setInternalValue(newValue);
    onChange(newValue);
  };

  // 이미지 드래그 앤 드롭 핸들러
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.warning("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      // 각 이미지 파일에 대해 업로드 처리
      for (const file of imageFiles) {
        // 즉시 업로드 중 플레이스홀더 삽입
        const uploadingPlaceholder = `![Uploading ${file.name}...]()\n`;
        const newValue = internalValue + uploadingPlaceholder;
        setInternalValue(newValue);
        onChange(newValue);

        // S3에 파일 업로드 시작 (비동기)
        const uploadId = await uploadFile(file, "markdown-images");

        // 플레이스홀더와 uploadId 매핑 저장
        uploadingPlaceholdersRef.current.set(uploadId, uploadingPlaceholder);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 이미지 파일이 포함되어 있는지 확인
    const items = Array.from(e.dataTransfer.items);
    const hasImageFile = items.some((item) => item.type.startsWith("image/"));

    if (hasImageFile) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 에디터 영역을 완전히 벗어났을 때만 상태 변경
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  if (disabled) {
    return (
      <div className="w-full mb-4 markdown-editor-styles">
        <MDEditor.Markdown source={internalValue} />
        <div className="text-right mt-2 text-gray-600 text-sm">
          {internalValue.length}자
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-4 markdown-editor-container markdown-editor-styles">
      <div className="flex justify-between items-center gap-2 mb-4">
        <div className="flex gap-2">
          <button
            className={cn(
              "px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all text-sm",
              mode === "edit"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-800 hover:bg-gray-100",
            )}
            onClick={() => setMode("edit")}
            type="button"
          >
            편집
          </button>
          <button
            className={cn(
              "px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all text-sm",
              mode === "live"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-800 hover:bg-gray-100",
            )}
            onClick={() => setMode("live")}
            type="button"
          >
            실시간 프리뷰
          </button>
          <button
            className={cn(
              "px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all text-sm",
              mode === "preview"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-800 hover:bg-gray-100",
            )}
            onClick={() => setMode("preview")}
            type="button"
          >
            프리뷰
          </button>
        </div>
        <HelpMarkdown />
      </div>

      <div
        className={cn(
          "transition-all duration-200 ease-in-out border-2 border-dashed rounded-lg relative",
          isDragOver
            ? "border-blue-600 bg-blue-50 before:content-['📁_이미지를_여기에_드롭하세요'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-blue-600/90 before:text-white before:px-6 before:py-3 before:rounded-lg before:font-medium before:z-10 before:pointer-events-none"
            : "border-transparent",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <MDEditor
          value={internalValue}
          onChange={handleChange}
          preview={mode}
          hideToolbar={false}
          visibleDragbar={false}
          overflow
          height={800}
          textareaProps={{
            placeholder,
            style: { height: 800 },
          }}
          data-color-mode="light"
        />
      </div>

      <div className="text-right mt-2 text-gray-600 text-sm">
        {internalValue.length}자
      </div>
    </div>
  );
};

export default MarkdownEditor;
