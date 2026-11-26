import { useController } from "react-hook-form";
import MarkdownEditorField from "../../MarkdownEditor/MarkdownEditorField";
import type { ArticleFormValues } from "../../lib/article-schema";
import type { ArticleBoardType } from "../../lib/article-permission";
import { FieldErrorMessage } from "./field-error";

type DescriptionFieldProps = {
  type: ArticleBoardType;
  disabled?: boolean;
};

/**
 * 본문(마크다운) 필드.
 *
 * 이미지는 MarkdownEditor 안에서 드래그 앤 드롭으로 S3 에 올라간다. 예전에는
 * base64 로 인라인하는 onImageUpload 를 함께 넘겼는데 에디터가 그 prop 을 쓰지
 * 않아 한 번도 불리지 않는 길이었다 — 지웠다.
 */
export const DescriptionField = ({
  type,
  disabled = false,
}: DescriptionFieldProps) => {
  const { field, fieldState } = useController<ArticleFormValues, "description">(
    { name: "description" },
  );

  return (
    <>
      <MarkdownEditorField
        value={field.value}
        onChange={field.onChange}
        type={type}
        disabled={disabled}
      />
      <FieldErrorMessage error={fieldState.error} />
    </>
  );
};
