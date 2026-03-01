import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { v2Admin } from "@packages/api";
import { useState } from "react";
import { toast } from "sonner";

export const PasswordChangePage = () => {
  const [formState, setFormState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const changePasswordMutation = v2Admin.usePatchApiV2AdminMePassword({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () => {
        toast.success("비밀번호가 성공적으로 변경되었습니다.");
        setFormState({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
        toast.error(message);
      },
    },
  });

  const validate = () => {
    let isValid = true;
    const newErrors = { newPassword: "", confirmPassword: "" };

    // New password validation: min 8 characters, at least one number
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(formState.newPassword)) {
      newErrors.newPassword = "비밀번호는 8자 이상이며 숫자를 포함해야 합니다.";
      isValid = false;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      newErrors.confirmPassword = "새 비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    changePasswordMutation.mutate({
      data: {
        currentPassword: formState.currentPassword,
        newPassword: formState.newPassword,
        newPasswordConfirm: formState.confirmPassword,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">비밀번호 변경</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              현재 비밀번호
            </label>
            <Input
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              value={formState.currentPassword}
              onChange={(e) =>
                setFormState({ ...formState, currentPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              새 비밀번호
            </label>
            <Input
              type="password"
              placeholder="새 비밀번호 (8자 이상, 숫자 포함)"
              value={formState.newPassword}
              onChange={(e) =>
                setFormState({ ...formState, newPassword: e.target.value })
              }
              required
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              새 비밀번호 확인
            </label>
            <Input
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              value={formState.confirmPassword}
              onChange={(e) =>
                setFormState({ ...formState, confirmPassword: e.target.value })
              }
              required
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
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
