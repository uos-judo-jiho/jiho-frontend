import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_PATHS } from "#shared/config/paths";
import { loginSchema, type LoginFormValues } from "../lib/schema";
import { useLoginMutation } from "../remote/use-login";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation({
    mutation: {
      onSuccess: () => {
        toast.success("로그인에 성공했습니다.");
        const destination = redirectTo
          ? decodeURIComponent(redirectTo)
          : AUTH_PATHS.home;
        if (destination.startsWith("http")) {
          window.location.href = destination;
        } else {
          navigate(destination, { replace: true });
          window.location.reload();
        }
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
        toast.error(message);
      },
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      data: values,
    });
  };

  return (
    <div className="h-dvh overflow-y-auto bg-white text-slate-900 flex flex-col">
      <div className="mx-auto flex flex-col gap-4 max-w-lg items-center justify-center px-6 py-12 flex-1">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
            <p className="text-sm text-slate-500">
              계정 정보를 입력해 로그인하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-600"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="이메일(아이디)"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-600"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="비밀번호"
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              className="h-11 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>

        {/* 회원가입 */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            계정이 없으신가요?
            <br />
            <Link
              to={AUTH_PATHS.register}
              className="text-slate-900 font-medium hover:text-slate-700"
            >
              {"회원가입 >"}
            </Link>
          </p>
        </div>
      </div>
      <footer className="border-t border-slate-200 py-4 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
        <ul>
          {/* 문의 이메일 정보 */}
          <li>
            <dl className="flex flex-wrap justify-center gap-2">
              <div>문의:</div>
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  <a
                    href="mailto:uosjudojiho@gmail.com"
                    className="text-slate-900 hover:text-slate-700"
                  >
                    uosjudojiho@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </li>
          {/* 서비스 담당자 */}
          <li>
            <dl className="flex flex-wrap justify-center gap-2">
              <div>서비스 담당자:</div>
              <div>
                <dt className="sr-only">Name</dt>
                <dd>34기 김영민</dd>
              </div>
            </dl>
          </li>
        </ul>
        <ul></ul>
        &copy; {new Date().getFullYear()} UOS Judo. All rights reserved.
      </footer>
    </div>
  );
};
