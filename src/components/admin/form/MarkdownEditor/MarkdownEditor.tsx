import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useFileUpload } from "@/hooks/upload/useFileUpload";
import { HelpMarkdown } from "@/components/admin/form/Help/HelpMarkdown";

const EditorContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  .w-md-editor-text {
    height: 100%;
  }
  .w-md-editor-text-pre .token.title {
    color: #0969da;
  }

  .w-md-editor-text-pre .token.bold {
    color: #1f2328;
    font-weight: bold;
  }

  .w-md-editor-text-pre .token.code {
    color: #cf222e;
    background-color: rgba(175, 184, 193, 0.2);
  }

  /* 툴바 스타일 */
  .w-md-editor-toolbar {
    background-color: #f6f8fa;
    border-bottom: 1px solid #d1d9e0;
  }

  .w-md-editor-toolbar-child > button {
    color: #656d76;
  }

  .w-md-editor-toolbar-child > button:hover {
    background-color: #d1d9e0;
    color: #1f2328;
  }

  /* 프리뷰 영역 */
  .wmde-markdown {
    background-color: white;
    font-size: ${(props) => props.theme.defaultFontSize || "14px"};
    line-height: 1.6;
  }

  .wmde-markdown h1,
  .wmde-markdown h2,
  .wmde-markdown h3,
  .wmde-markdown h4,
  .wmde-markdown h5,
  .wmde-markdown h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  .wmde-markdown p {
    margin-bottom: 1em;
    text-indent: 0.4em;
  }

  .wmde-markdown ul,
  .wmde-markdown ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
    // 마커 표시
    list-style-type: disc;
  }

  .wmde-markdown li {
    margin-bottom: 0.3em;
  }

  .wmde-markdown blockquote {
    border-left: 4px solid #d1d9e0;
    margin: 1em 0;
    padding-left: 1em;
    font-style: italic;
    color: #656d76;
  }

  .wmde-markdown code {
    background-color: rgba(175, 184, 193, 0.2);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family:
      "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
  }

  .wmde-markdown pre {
    background-color: #f6f8fa;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1em 0;
  }

  .wmde-markdown pre code {
    background-color: transparent;
    padding: 0;
  }

  .wmde-markdown table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  .wmde-markdown th,
  .wmde-markdown td {
    border: 1px solid #d1d9e0;
    padding: 0.5em;
    text-align: left;
  }

  .wmde-markdown th {
    background-color: #f6f8fa;
    font-weight: bold;
  }

  /* 드래그 앤 드롭 스타일 */
  .md-editor-wrapper {
    transition: all 0.2s ease;
    border: 2px dashed transparent;
    border-radius: 8px;
  }

  .md-editor-wrapper.drag-over {
    border-color: #0969da;
    background-color: rgba(9, 105, 218, 0.05);
  }

  .md-editor-wrapper.drag-over::before {
    content: "📁 이미지를 여기에 드롭하세요";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(9, 105, 218, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10;
    pointer-events: none;
  }
`;

const CharacterCount = styled.div`
  text-align: right;
  margin-top: 0.5rem;
  color: #656d76;
  font-size: 0.9em;
`;

const ModeToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ModeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ModeButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d9e0;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? "#0969da" : "white")};
  color: ${(props) => (props.active ? "white" : "#1f2328")};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#0550ae" : "#f6f8fa")};
  }
`;

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
  placeholder = "마크다운으로 내용을 작성하세요...\n\n# 제목\n\n**굵은 글씨**와 *기울임꼴*을 사용할 수 있습니다.\n\n- 리스트 항목 1\n- 리스트 항목 2\n\n```javascript\n// 코드 블록도 지원됩니다\nconsole.log('Hello, World!');\n```\n\n> 인용구도 사용 가능합니다.\n\n[링크](https://example.com)와 이미지도 추가할 수 있습니다.",
  onImageUpload,
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
      alert("이미지 파일만 업로드할 수 있습니다.");
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
      alert("이미지 업로드에 실패했습니다.");
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
      <EditorContainer>
        <MDEditor.Markdown source={internalValue} />
        <CharacterCount>{internalValue.length}자</CharacterCount>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer className="markdown-editor-container">
      <ModeToggle>
        <ModeButtons>
          <ModeButton
            active={mode === "edit"}
            onClick={() => setMode("edit")}
            type="button"
          >
            편집
          </ModeButton>
          <ModeButton
            active={mode === "live"}
            onClick={() => setMode("live")}
            type="button"
          >
            실시간 프리뷰
          </ModeButton>
          <ModeButton
            active={mode === "preview"}
            onClick={() => setMode("preview")}
            type="button"
          >
            프리뷰
          </ModeButton>
        </ModeButtons>
        <HelpMarkdown />
      </ModeToggle>

      <div
        className={`md-editor-wrapper ${isDragOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        style={{ position: "relative" }}
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

      <CharacterCount>{internalValue.length}자</CharacterCount>
    </EditorContainer>
  );
};

export default MarkdownEditor;
