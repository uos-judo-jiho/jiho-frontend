import { toBase64 } from "@/shared/lib/utils/Utils";
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
 * onImageUpload 는 레거시 경로다. 드래그 앤 드롭은 MarkdownEditor 안에서 S3 로
 * 직접 올라가고, 여기로 들어오는 파일은 base64 로만 인라인된다.
 */
export const DescriptionField = ({
  type,
  disabled = false,
}: DescriptionFieldProps) => {
  const { field, fieldState } = useController<ArticleFormValues, "description">(
    { name: "description" },
  );

  const uploadInlineImage = async (file: File) => {
    try {
      return await toBase64(file);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <>
      <MarkdownEditorField
        value={field.value}
        onChange={field.onChange}
        onImageUpload={uploadInlineImage}
        type={type}
        disabled={disabled}
      />
      <FieldErrorMessage error={fieldState.error} />
    </>
  );
};
