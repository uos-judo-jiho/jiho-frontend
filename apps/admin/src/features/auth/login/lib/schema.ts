import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .refine(
      (val) => val === "uosjudojiho" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      {
        message: "유효한 이메일을 입력해주세요.",
      },
    ),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
