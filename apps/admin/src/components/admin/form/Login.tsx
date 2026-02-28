import { RouterUrl } from "@/app/routers/router-url";
import { v2Admin } from "@packages/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const loginMutation = v2Admin.usePostApiV2AdminLogin({
    mutation: {
      onSuccess: () => {
        toast.success("로그인에 성공했습니다.");
        navigate(RouterUrl.홈, { replace: true });
        window.location.reload();
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
        toast.error(message);
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({
      data: {
        ...formState,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex flex-col gap-4 min-h-screen max-w-lg items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              UOS Judo Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              관리자 로그인
            </h1>
            <p className="text-sm text-slate-500">
              계정 정보를 입력하고 관리자 페이지로 이동하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-slate-600"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                value={formState.email}
                onChange={(event) =>
                  setFormState({
                    ...formState,
                    email: event.currentTarget.value,
                  })
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="관리자 이메일"
                required={true}
              />
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
                name="password"
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState({
                    ...formState,
                    password: event.currentTarget.value,
                  })
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="비밀번호"
                required={true}
              />
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
              to={RouterUrl.회원가입}
              className="text-slate-900 font-medium hover:text-slate-700"
            >
              {"회원가입 >"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
