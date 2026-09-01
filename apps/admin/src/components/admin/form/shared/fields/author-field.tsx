import { Input } from "@/components/ui/input";
import {
  InputContainer,
  StyledLabel,
} from "../../StyledComponent/FormContainer";

type AuthorFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** 임원 미만 등급은 작성자가 본인으로 고정된다. */
  fixed?: boolean;
};

export const AuthorField = ({
  value,
  onChange,
  disabled = false,
  fixed = false,
}: AuthorFieldProps) => (
  <InputContainer>
    <StyledLabel htmlFor="author" aria-required="true">
      작성자
    </StyledLabel>
    <Input
      id="author"
      name="author"
      type="text"
      required
      disabled={disabled}
      readOnly={fixed}
      aria-readonly={fixed}
      className={
        fixed && !disabled
          ? "bg-gray-100 cursor-not-allowed focus-visible:ring-0"
          : undefined
      }
      placeholder="34기 김영민 (컴과 18) 혹은 김영민"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {fixed && !disabled && (
      <small className="text-gray-500">
        회원 등급은 본인 명의의 글만 작성할 수 있어요. 작성자 변경이 필요하면
        운영진에게 문의해주세요.
      </small>
    )}
  </InputContainer>
);
