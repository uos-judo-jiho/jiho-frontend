import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { ArticleFormValues } from "../../lib/article-schema";
import {
  InputContainer,
  StyledLabel,
} from "../../StyledComponent/FormContainer";
import { FieldErrorMessage } from "./field-error";

type TitleFieldProps = {
  disabled?: boolean;
  placeholder?: string;
};

export const TitleField = ({
  disabled = false,
  placeholder = "제목을 입력하세요",
}: TitleFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ArticleFormValues>();

  return (
    <InputContainer>
      <StyledLabel htmlFor="title" aria-required="true">
        제목
      </StyledLabel>
      <Input
        id="title"
        type="text"
        disabled={disabled}
        aria-invalid={Boolean(errors.title)}
        placeholder={placeholder}
        {...register("title")}
      />
      <FieldErrorMessage error={errors.title} />
    </InputContainer>
  );
};
