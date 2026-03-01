import { RouterUrl } from "@/app/routers/router-url";
import { v2Admin } from "@packages/api";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Register = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signupMutation = v2Admin.usePostApiV2AdminSignup({
    mutation: {
      onSuccess: () => {
        toast.success("회원가입이 완료되었습니다.");
        window.location.href = RouterUrl.로그인;
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

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", confirmPassword: "" };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
      isValid = false;
    }

    // Password validation: min 8 characters, at least one number
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(formState.password)) {
      newErrors.password =
        "비밀번호는 8자 이상이며 숫자를 1개 이상 포함해야 해요.";
      isValid = false;
    }

    // Confirm Password validation
    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      signupMutation.mutate({
        data: {
          email: formState.email,
          password: formState.password,
          passwordConfirm: formState.confirmPassword,
        },
      });
    }
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                name="email"
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState({
                    ...formState,
                    email: event.currentTarget.value,
                  })
                }
                className={cn(
                  "h-11 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
                )}
                placeholder="이메일 주소"
                required={true}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
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
                name="password"
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState({
                    ...formState,
                    password: event.currentTarget.value,
                  })
                }
                className={cn(
                  "h-11 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
                )}
                placeholder="비밀번호 (8자 이상, 숫자 포함)"
                required={true}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
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
                name="confirmPassword"
                type="password"
                value={formState.confirmPassword}
                onChange={(event) =>
                  setFormState({
                    ...formState,
                    confirmPassword: event.currentTarget.value,
                  })
                }
                className={cn(
                  "h-11 w-full rounded-lg border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
                )}
                placeholder="비밀번호 확인"
                required={true}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
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

// Helper function for class names (similar to cn from shadcn/ui or existing utils)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
