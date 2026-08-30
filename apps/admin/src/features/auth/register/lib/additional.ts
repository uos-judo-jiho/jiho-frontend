import * as z from "zod";

/* ------------------------------------------------------------------ */
/* 추가 정보(선택) — 가입 시점 / 승인 전 모두 동일 필드를 공유한다.        */
/* ------------------------------------------------------------------ */

export const additionalSchema = z.object({
  name: z.string().trim().max(20, "이름은 20자 이하여야 합니다.").optional(),
  major: z.string().trim().max(20, "학과는 20자 이하여야 합니다.").optional(),
  year: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (/^\d+$/.test(v) && Number(v) > 0),
      "기수는 1 이상의 정수여야 합니다.",
    )
    .optional(),
  studentId: z
    .string()
    .trim()
    .max(20, "학번은 20자 이하여야 합니다.")
    .optional(),
  // 010 프리픽스는 UI 에서 고정되고, 폼에는 뒤 8자리(1234-5678)만 담는다.
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^\d{4}-\d{4}$/.test(v),
      "연락처 뒤 8자리를 입력해주세요. (예: 1234-5678)",
    )
    .optional(),
});

export type AdditionalValues = z.infer<typeof additionalSchema>;

type AdditionalPayload = {
  name?: string;
  major?: string;
  year?: number;
  studentId?: string;
  phoneNumber?: string;
};

export const PHONE_PREFIX = "010";

/** 010 이후 8자리를 1234-5678 형태로 포맷한다(부분 입력도 점진적으로 포맷). */
export const formatPhoneSuffix = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

/** 빈 문자열 필드는 제외하고, year 는 숫자로 변환한 payload 를 만든다. */
export const toAdditionalPayload = (
  values: AdditionalValues,
): AdditionalPayload => {
  const payload: AdditionalPayload = {};
  if (values.name) payload.name = values.name;
  if (values.major) payload.major = values.major;
  if (values.studentId) payload.studentId = values.studentId;
  // 010 프리픽스를 붙이고 하이픈을 제거해 숫자 11자리로 전송한다.
  if (values.phoneNumber) {
    const digits = values.phoneNumber.replace(/\D/g, "");
    if (digits) payload.phoneNumber = `${PHONE_PREFIX}${digits}`;
  }
  if (values.year && values.year.trim() !== "")
    payload.year = Number(values.year);
  return payload;
};

export const EMPTY_ADDITIONAL: AdditionalValues = {
  name: "",
  major: "",
  year: "",
  studentId: "",
  phoneNumber: "",
};

export const ADDITIONAL_FIELDS: {
  name: keyof AdditionalValues;
  label: string;
  placeholder: string;
  type?: string;
  inputMode?: "numeric";
  maxLength?: number;
  /** 좌측에 고정 표시되는 프리픽스(예: 연락처 "010"). */
  prefix?: string;
  /** 입력 시 숫자만 남기고 뒤 8자리를 1234-5678 로 포맷한다(연락처). */
  digitsOnly?: boolean;
}[] = [
  { name: "name", label: "이름", placeholder: "이름" },
  { name: "major", label: "학과", placeholder: "소속 학과" },
  { name: "year", label: "기수", placeholder: "예) 15", type: "number" },
  { name: "studentId", label: "학번", placeholder: "학번" },
  {
    name: "phoneNumber",
    label: "연락처",
    placeholder: "1234-5678",
    type: "tel",
    inputMode: "numeric",
    maxLength: 9, // 1234-5678
    prefix: PHONE_PREFIX,
    digitsOnly: true,
  },
];
