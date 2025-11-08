import MarkdownEditor from "./MarkdownEditor";
import { InputContainer, StyledLabel } from "../StyledComponent/FormContainer";

type MarkdownEditorFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  type: "news" | "training" | "notice";
  disabled?: boolean;
};

function MarkdownEditorField({
  value,
  onChange,
  onImageUpload,
  type,
  disabled = false,
}: MarkdownEditorFieldProps) {
  const getPlaceholder = () => {
    const contentType =
      type === "training"
        ? "훈련일지"
        : type === "news"
        ? "지호지"
        : "공지사항";

    return `마크다운으로 ${contentType} 내용을 작성하세요...

# 제목 예시

**굵은 글씨**와 *기울임꼴*을 사용할 수 있습니다.

## 소제목

- 리스트 항목 1
- 리스트 항목 2

### 세부 내용

1. 순서가 있는 목록
2. 두 번째 항목

> 인용구도 사용할 수 있습니다.

\`\`\`
코드 블록도 지원됩니다
\`\`\`

[링크 텍스트](https://example.com)

**💡 이미지 추가하기**
- 이미지 파일을 에디터로 드래그 앤 드롭하세요
- 자동으로 마크다운 이미지 문법이 삽입됩니다!`;
  };

  return (
    <InputContainer>
      <StyledLabel htmlFor="description" aria-required="true">
        <div className="flex flex-col">
          <span>본문 (마크다운 지원)</span>
          <small>
            본문 내부에 이미지를 넣으려면 이미지를 드래그 앤 드랍하세요
          </small>
        </div>
      </StyledLabel>
      <MarkdownEditor
        value={value}
        onChange={onChange}
        disabled={disabled}
        onImageUpload={onImageUpload}
        placeholder={getPlaceholder()}
      />
    </InputContainer>
  );
}

export default MarkdownEditorField;
