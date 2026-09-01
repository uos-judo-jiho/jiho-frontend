import { Input } from "@/components/ui/input";
import {
  InputContainer,
  StyledLabel,
} from "../../StyledComponent/FormContainer";

type DateFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
};

export const DateField = ({
  value,
  onChange,
  disabled = false,
  label = "날짜",
}: DateFieldProps) => (
  <InputContainer>
    <StyledLabel htmlFor="date" aria-required="true">
      {label}
    </StyledLabel>
    <Input
      id="date"
      name="date"
      type="date"
      required
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </InputContainer>
);
