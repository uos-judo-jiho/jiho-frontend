import { HelpMarkdown } from "@/components/admin/form/Help/HelpMarkdown";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/shared/hooks/useFileUpload";
import { cn } from "@/shared/lib/utils";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

type EditorMode = "edit" | "preview" | "live";

const MODES: { value: EditorMode; label: string }[] = [
  { value: "edit", label: "편집" },
  { value: "live", label: "실시간 프리뷰" },
  { value: "preview", label: "프리뷰" },
];

/**
 * 에디터 기본 높이(px).
 *
 * 800 이었는데 1080p 노트북에서는 그것만으로 화면을 거의 다 먹어서, 아래의
 * 저장 버튼까지 가려면 폼을 한참 스크롤해야 했다. 560 으로 줄이고 대신
 * 드래그바를 켜서 긴 글을 쓸 때는 쓰는 사람이 직접 늘리게 한다 — 어떤 숫자를
 * 골라도 화면 크기마다 맞지 않으므로 손잡이를 주는 쪽이 낫다.
 */
const DEFAULT_HEIGHT = 560;

export const MarkdownEditor = ({
  value,
  onChange,
  disabled = false,
  placeholder,
}: MarkdownEditorProps) => {
  const [mode, setMode] = useState<EditorMode>("live");
  const [isDragOver, setIsDragOver] = useState(false);
  const { uploadFile, uploadsArray } = useFileUpload();
  const uploadingPlaceholdersRef = useRef<Map<string, string>>(new Map());

  /**
   * 업로드가 끝나면 끼워 둔 플레이스홀더를 실제 이미지(또는 지움)로 바꾼다.
   *
   * 예전에는 본문을 `internalValue` state 로 한 벌 더 들고 `value` 가 바뀔 때마다
   * effect 로 맞췄다. prop 을 state 로 복사하는 그 구조가 "입력하는 동안 값이
   * 되돌아가는" 종류의 버그를 부르므로 걷어냈다 — 본문의 유일한 출처는 `value` 다.
   *
   * 그래서 `value` 를 의존성에 둔다. 타이핑마다 효과가 돌지만, 처리할 업로드가
   * 없으면 빈 배열을 한 번 훑고 끝난다. 끝난 업로드는 map 에서 지우므로 같은
   * 치환이 두 번 일어나지 않는다.
   */
  useEffect(() => {
    for (const upload of uploadsArray) {
      const placeholder = uploadingPlaceholdersRef.current.get(upload.uploadId);
      if (!placeholder) continue;

      if (upload.status === "completed" && upload.url) {
        uploadingPlaceholdersRef.current.delete(upload.uploadId);
        onChange(value.replace(placeholder, `![Image](${upload.url})`));
        continue;
      }

      if (upload.status === "error") {
        uploadingPlaceholdersRef.current.delete(upload.uploadId);
        toast.error(
          `이미지 업로드에 실패했습니다: ${upload.error ?? "알 수 없는 오류"}`,
        );
        // 실패한 플레이스홀더는 본문에서 지운다 — 깨진 이미지 문법을 남기면
        // 글쓴이가 직접 찾아 지워야 한다
        onChange(value.replace(placeholder, ""));
      }
    }
  }, [uploadsArray, value, onChange]);

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const imageFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      toast.warning("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 여러 장을 올릴 때 사이사이 await 가 들어가므로 prop 으로 온 value 는 곧
    // 낡는다. 이 핸들러가 본문을 이어 붙이는 주체이니 여기서 직접 들고 간다
    let text = value;

    for (const file of imageFiles) {
      // 업로드를 기다리는 동안 자리를 잡아 둔다. 파일 이름을 넣어 여러 장을
      // 동시에 올려도 서로 다른 문자열이 되게 한다
      const uploadingPlaceholder = `![${file.name} 올리는 중…]()\n`;

      text += uploadingPlaceholder;
      onChange(text);

      try {
        const uploadId = await uploadFile(file, "markdown-images");
        uploadingPlaceholdersRef.current.set(uploadId, uploadingPlaceholder);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("이미지 업로드에 실패했습니다.");
        text = text.replace(uploadingPlaceholder, "");
        onChange(text);
      }
    }
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const hasImageFile = Array.from(event.dataTransfer.items).some((item) =>
      item.type.startsWith("image/"),
    );

    if (hasImageFile) setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // 에디터 영역을 완전히 벗어났을 때만 끈다 — 안쪽 요소를 지날 때마다
    // dragleave 가 오므로 좌표로 확인한다
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const { clientX: x, clientY: y } = event;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  if (disabled) {
    return (
      <div className="markdown-editor-styles w-full">
        <MDEditor.Markdown source={value} />
        <CharacterCount value={value} />
      </div>
    );
  }

  return (
    <div className="markdown-editor-container markdown-editor-styles w-full">
      <div className="mb-3 flex items-center justify-between gap-2">
        {/*
          예전에는 bg-blue-600 · border-gray-300 을 직접 써서 admin 의 다른
          버튼들과 색·높이가 달랐다. shadcn Button 으로 바꿔 팔레트를 따른다
        */}
        <div className="flex gap-1">
          {MODES.map(({ value: modeValue, label }) => (
            <Button
              key={modeValue}
              type="button"
              size="sm"
              variant={mode === modeValue ? "default" : "outline"}
              aria-pressed={mode === modeValue}
              onClick={() => setMode(modeValue)}
            >
              {label}
            </Button>
          ))}
        </div>
        <HelpMarkdown />
      </div>

      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors duration-200",
          isDragOver
            ? "border-primary bg-primary/5 before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:z-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-lg before:bg-primary/90 before:px-6 before:py-3 before:font-medium before:text-primary-foreground before:content-['📁_이미지를_여기에_드롭하세요']"
            : "border-transparent",
        )}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <MDEditor
          value={value}
          onChange={(next) => onChange(next ?? "")}
          preview={mode}
          height={DEFAULT_HEIGHT}
          // 긴 글에서는 쓰는 사람이 직접 높이를 늘릴 수 있어야 한다
          visibleDragbar
          minHeight={320}
          maxHeight={1200}
          overflow
          // textareaProps 에 height 를 넣지 않는다. 라이브러리는 입력
          // textarea 를 `position:absolute; height:100%` 로 두어 내용에 따라
          // 자라는 하이라이트 층(.w-md-editor-text-pre, pointer-events:none)에
          // 맞춘다. 여기서 px 를 박으면 그 높이를 넘는 아래쪽 클릭이 textarea 를
          // 비켜 가 캐럿이 잡히지 않는다 — 긴 글에서 "아래를 눌러도 커서가 안
          // 간다" 던 원인이다
          textareaProps={{ placeholder }}
          data-color-mode="light"
        />
      </div>

      <CharacterCount value={value} />
    </div>
  );
};

const CharacterCount = ({ value }: { value: string }) => (
  <p className="mt-2 text-right text-sm text-muted-foreground tabular-nums">
    {value.length.toLocaleString()}자
  </p>
);

export default MarkdownEditor;
