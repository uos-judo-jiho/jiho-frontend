import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { v2Admin } from "@packages/api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(/[0-9]/, "숫자를 하나 이상 포함해야 합니다."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "새 비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordChangePage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = v2Admin.usePatchApiV2AdminMePassword({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () => {
        toast.success("비밀번호가 성공적으로 변경되었습니다.");
        reset();
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
        toast.error(message);
      },
    },
  });

  const onSubmit = (values: PasswordFormValues) => {
    changePasswordMutation.mutate({
      data: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        newPasswordConfirm: values.confirmPassword,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">비밀번호 변경</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              현재 비밀번호
            </label>
            <Input
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              새 비밀번호
            </label>
            <Input
              type="password"
              placeholder="새 비밀번호 (8자 이상, 숫자 포함)"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              새 비밀번호 확인
            </label>
            <Input
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-24">
          <Button
            type="submit"
            className="w-full"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending
              ? "변경 중..."
              : "비밀번호 변경하기"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
