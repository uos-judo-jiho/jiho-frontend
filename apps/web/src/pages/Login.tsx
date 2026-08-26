import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Navbar from "@/components/common/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logger } from "@99mini/logger-client";
import { v2Admin } from "@packages/api";

const routeApi = getRouteApi("/login");

const Login = () => {
  const { redirectTo } = routeApi.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = v2Admin.usePostApiV2AdminLogin({
    mutation: {
      onSuccess: () => {
        const destination = redirectTo ? decodeURIComponent(redirectTo) : "/";
        // 로그인 후 세션 쿠키 반영을 위해 전체 새로고침으로 이동
        window.location.href = destination;
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.message ||
          "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
        setError(message);
      },
    },
    axios: {
      withCredentials: true,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    loginMutation.mutate({
      data: {
        email,
        password,
      },
    });
  };

  useEffect(() => {
    logger.info("로그인 페이지 방문", { path: window.location.pathname });
  }, []);

  return (
    <>
      <Navbar isDark={true} />
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              로그인
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              서울시립대학교 유도부 지호 서비스 이용을 위해 로그인해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  이메일
                </label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  required
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  비밀번호
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}

            <div>
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              관리자 계정이 필요하신가요?{" "}
              <a
                href="https://admin.uosjudo.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                관리자 신청하기
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
