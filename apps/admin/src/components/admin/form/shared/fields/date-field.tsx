import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { ArticleFormValues } from "../../lib/article-schema";
import {
  InputContainer,
  StyledLabel,
} from "../../StyledComponent/FormContainer";
import { FieldErrorMessage } from "./field-error";

type DateFieldProps = {
  disabled?: boolean;
  label?: string;
};

export const DateField = ({
  disabled = false,
  label = "날짜",
}: DateFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ArticleFormValues>();

  return (
    <InputContainer>
      <StyledLabel htmlFor="date" aria-required="true">
        {label}
      </StyledLabel>
      <Input
        id="date"
        type="date"
        disabled={disabled}
        aria-invalid={Boolean(errors.dateTime)}
        {...register("dateTime")}
      />
      <FieldErrorMessage error={errors.dateTime} />
    </InputContainer>
  );
};
