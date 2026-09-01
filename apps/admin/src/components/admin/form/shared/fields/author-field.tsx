import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { ArticleFormValues } from "../../lib/article-schema";
import {
  InputContainer,
  StyledLabel,
} from "../../StyledComponent/FormContainer";
import { FieldErrorMessage } from "./field-error";

type AuthorFieldProps = {
  disabled?: boolean;
  /** 임원 미만 등급은 작성자가 본인으로 고정된다. */
  fixed?: boolean;
};

export const AuthorField = ({
  disabled = false,
  fixed = false,
}: AuthorFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ArticleFormValues>();

  return (
    <InputContainer>
      <StyledLabel htmlFor="author" aria-required="true">
        작성자
      </StyledLabel>
      <Input
        id="author"
        type="text"
        disabled={disabled}
        readOnly={fixed}
        aria-readonly={fixed}
        aria-invalid={Boolean(errors.author)}
        className={
          fixed && !disabled
            ? "bg-gray-100 cursor-not-allowed focus-visible:ring-0"
            : undefined
        }
        placeholder="34기 김영민 (컴과 18) 혹은 김영민"
        {...register("author")}
      />
      {fixed && !disabled && (
        <small className="text-gray-500">
          회원 등급은 본인 명의의 글만 작성할 수 있어요. 작성자 변경이 필요하면
          운영진에게 문의해주세요.
        </small>
      )}
      <FieldErrorMessage error={errors.author} />
    </InputContainer>
  );
};
