import { RouterUrl } from "@/app/routers/router-url";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { v2Admin } from "@packages/api";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z
  .object({
    email: z
      .string()
      .email("유효한 이메일 주소를 입력해주세요.")
      .min(1, "이메일을 입력해주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(/[0-9]/, "숫자를 1개 이상 포함해야 해요."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = v2Admin.usePostApiV2AdminSignup({
    mutation: {
      onSuccess: () => {
        toast.success("회원가입이 완료되었습니다.");
        navigate(RouterUrl.로그인);
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message || "회원가입에 실패했습니다.";
        toast.error(message);
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    signupMutation.mutate({
      data: {
        email: values.email,
        password: values.password,
        passwordConfirm: values.confirmPassword,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              UOS Judo Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              관리자 회원가입
            </h1>
            <p className="text-sm text-slate-500">
              관리자 계정을 생성하여 지호 서비스를 관리하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-600"
                aria-required
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={cn(
                  "h-11 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
                )}
                placeholder="이메일 주소"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-600"
                aria-required
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={cn(
                  "h-11 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
                )}
                placeholder="비밀번호 (8자 이상, 숫자 포함)"
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-600"
                aria-required
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={cn(
                  "h-11 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
                )}
                placeholder="비밀번호 확인"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                className="h-11 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                type="submit"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "가입 중..." : "회원가입"}
              </button>
            </div>

            <div className="text-center mt-4">
              <div className="text-sm text-slate-800">
                이미 계정이 있으신가요?
                <br />
                <Link
                  to={RouterUrl.로그인}
                  className="ml-1 font-medium text-slate-900 hover:underline"
                >
                  로그인하기
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
