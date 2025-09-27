import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
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
`;

const CharacterCount = styled.div`
  text-align: right;
  margin-top: 0.5rem;
  color: #656d76;
  font-size: 0.9em;
`;

const ModeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

  // value prop이 변경될 때 내부 상태 동기화
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (val?: string) => {
    const newValue = val || "";
    setInternalValue(newValue);
    onChange(newValue);
  };

  // 이미지 드래그 앤 드롭 핸들러
  const handleDrop = async (e: React.DragEvent) => {
    // TODO: 이벤트 기반 이미지 업로드 처리
    // 드래그 앤 드롭으로 이미지 업로드 시작 -> id생성하여 업로드 중 표시 -> 업로드 완료 후 마크다운에 이미지 삽입
    // 업로드 비동기 처리 시 텍스트 입력을 막지 않도록 구현
    // 텍스트 입력 막지 않는 방법
    // 1. 업로드 완료 메시지 worker에서 처리
    // 2. 프론트엔드 서버 SSE 통신 처리
    alert(
      "이미지 드래그 앤 드롭 기능은 아직 지원하지 않습니다. 이미지 업로드 버튼을 이용해주세요."
    );

    e.preventDefault();
    e.stopPropagation();
    return;

    // if (!onImageUpload) return;

    // const files = Array.from(e.dataTransfer.files);
    // const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // if (imageFiles.length === 0) return;

    // // 업로드 중일 때 현재 커서 위치에 업로드 중 표시
    // // 업로드 파일 만큼 반복
    // const uploadingIds = imageFiles.map((_) => {
    //   const id = Math.random().toString(36).substring(2, 15);
    //   const uploadingText = `\n![\`Uploading image...${id}\`]()\n`;
    //   const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart;
    //   const newValue =
    //     internalValue.slice(0, cursorPosition) +
    //     uploadingText +
    //     internalValue.slice(cursorPosition);
    //   setInternalValue(newValue);
    //   onChange(newValue);

    //   return id;
    // });

    // try {
    //   for (const file of imageFiles) {
    //     const imageUrl = await onImageUpload(file);
    //     const imageMarkdown = `![${file.name}](${imageUrl})\n`;

    //     // 현재 커서 위치에 이미지 삽입
    //     const newValue = internalValue + imageMarkdown;
    //     setInternalValue((prev) => {
    //       // 업로드 중 표시 제거
    //       let updatedValue = prev;
    //       uploadingIds.forEach((id) => {
    //         const uploadingText = `\n![\`Uploading image...${id}\`]()\n`;
    //         updatedValue = updatedValue.replace(uploadingText, imageMarkdown);
    //       });
    //       return updatedValue;
    //     });
    //     onChange(newValue);
    //   }
    // } catch (error) {
    //   console.error("Image upload failed:", error);
    //   alert("이미지 업로드에 실패했습니다.");
    // } finally {
    // }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      </ModeToggle>

      <div
        className="md-editor-wrapper"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
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
