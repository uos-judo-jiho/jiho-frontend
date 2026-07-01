import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import {
  ADDITIONAL_FIELDS,
  formatPhoneSuffix,
  type AdditionalValues,
} from "../lib/additional";
import { Field } from "./field";
import { TextInput } from "./text-input";

export const AdditionalFieldsSection = ({
  register,
  errors,
  hint,
}: {
  // 두 폼(가입/프로필)이 공유 — AdditionalValues 필드를 register 할 수 있으면 된다.
  register: (
    name: keyof AdditionalValues,
    options?: { onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void },
  ) => UseFormRegisterReturn;
  errors: Partial<Record<keyof AdditionalValues, FieldError>>;
  hint: string;
}) => (
  <div className="space-y-5 border-t border-slate-100 pt-5">
    <p className="text-sm font-medium text-slate-700">
      추가 정보
      <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>
    </p>
    {ADDITIONAL_FIELDS.map((field) => (
      <Field key={field.name} label={field.label} error={errors[field.name]}>
        <TextInput
          type={field.type}
          inputMode={field.inputMode}
          maxLength={field.maxLength}
          prefix={field.prefix}
          placeholder={field.placeholder}
          invalid={!!errors[field.name]}
          registration={register(
            field.name,
            field.digitsOnly
              ? {
                  // 숫자만 받아 뒤 8자리를 1234-5678 형태로 자동 포맷해 표시한다.
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = formatPhoneSuffix(e.target.value);
                  },
                }
              : undefined,
          )}
        />
      </Field>
    ))}
  </div>
);
