import { Input } from "@/components/ui/input";
import {
  InputContainer,
  StyledLabel,
} from "../../StyledComponent/FormContainer";

type TitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const TitleField = ({
  value,
  onChange,
  disabled = false,
  placeholder = "제목을 입력하세요",
}: TitleFieldProps) => (
  <InputContainer>
    <StyledLabel htmlFor="title" aria-required="true">
      제목
    </StyledLabel>
    <Input
      id="title"
      name="title"
      type="text"
      required
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </InputContainer>
);
