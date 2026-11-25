import { DatePicker } from "@packages/jds/ui";
import { useController, useFormContext } from "react-hook-form";

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

/**
 * 글 작성·수정 폼의 날짜 입력.
 *
 * native `type="date"` 를 jds 달력으로 바꿨다. 값의 모양은 그대로
 * `YYYY-MM-DD` 라서 `article-schema` 와 서버로 보내는 값은 건드리지 않았다.
 *
 * `register` 대신 `useController` 를 쓴다 — jds 달력은 DOM 이벤트가 아니라
 * `onChange(value)` 로 값을 주므로 register 의 ref/이벤트 연결이 맞지 않는다.
 */
export const DateField = ({
  disabled = false,
  label = "날짜",
}: DateFieldProps) => {
  const { control } = useFormContext<ArticleFormValues>();
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: "dateTime" });

  return (
    <InputContainer>
      <StyledLabel htmlFor="date" aria-required="true">
        {label}
      </StyledLabel>
      <DatePicker
        id="date"
        value={field.value ?? ""}
        onChange={field.onChange}
        disabled={disabled}
        required
        aria-invalid={Boolean(error)}
      />
      <FieldErrorMessage error={error} />
    </InputContainer>
  );
};
