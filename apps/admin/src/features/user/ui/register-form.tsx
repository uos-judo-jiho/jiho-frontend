import { RouterUrl } from "@/app/routers/router-url";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const RegisterForm = () => {
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
      onError: (error) => {
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
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">관리자 회원가입</CardTitle>
        <CardDescription>
          관리자 계정을 생성하여 지호 서비스를 관리하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-600"
            >
              이메일
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="이메일 주소"
              aria-invalid={!!errors.email}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-600"
            >
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="비밀번호 (8자 이상, 숫자 포함)"
              aria-invalid={!!errors.password}
              className={cn(errors.password && "border-destructive")}
            />
            {errors.password && (
              <p className="text-xs text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-600"
            >
              비밀번호 확인
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="비밀번호 확인"
              aria-invalid={!!errors.confirmPassword}
              className={cn(errors.confirmPassword && "border-destructive")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "가입 중..." : "회원가입"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?
              <br />
              <Link
                to={RouterUrl.로그인}
                className="font-medium text-primary hover:underline ml-1"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
