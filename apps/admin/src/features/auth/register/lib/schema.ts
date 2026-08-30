import * as z from "zod";

import { additionalSchema } from "./additional";

/* 회원 유형(권한) — API 스키마상 optional 이지만 가입 UX 상 필수로 받는다. */
export const REQUESTED_ROLE_OPTIONS = [
  { value: "general", label: "재학생" },
  { value: "graduate", label: "졸업생" },
] as const;

export const signupSchema = additionalSchema.extend({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("유효한 이메일 주소를 입력해주세요."),
  requestedRole: z.enum(["general", "graduate"], {
    error: "회원 유형을 선택해주세요.",
  }),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .regex(/[0-9]/, "숫자를 1개 이상 포함해야 해요."),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
});

export const signupSchemaWithMatch = signupSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: "비밀번호가 일치하지 않습니다.", path: ["confirmPassword"] },
);

export type SignupValues = z.infer<typeof signupSchema>;
