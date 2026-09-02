import { useController } from "react-hook-form";
import ImageUploader from "../../ImageUploader/ImageUploader";
import type { ArticleFormValues } from "../../lib/article-schema";
import { FieldErrorMessage } from "./field-error";

type ImageFieldProps = {
  imageLimit?: number;
  disabled?: boolean;
};

/**
 * 사진 필드.
 *
 * 폼에는 `{ originSrc, smallSrc }` 로 담기지만 업로더는 URL 문자열만 다루므로
 * 여기서 두 모양을 이어붙인다.
 */
export const ImageField = ({
  imageLimit = 10,
  disabled = false,
}: ImageFieldProps) => {
  const { field, fieldState } = useController<ArticleFormValues, "images">({
    name: "images",
  });

  return (
    <>
      <ImageUploader
        value={field.value.map(({ originSrc }) => originSrc)}
        onChange={(next) =>
          field.onChange(
            next.map((originSrc) => ({ originSrc, smallSrc: null })),
          )
        }
        imageLimit={imageLimit}
        disabled={disabled}
      />
      <FieldErrorMessage error={fieldState.error} />
    </>
  );
};
