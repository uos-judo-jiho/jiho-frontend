import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_PATHS } from "#shared/config/paths";
import { extractMessage } from "#shared/lib/extract-message";
import {
  EMPTY_ADDITIONAL,
  toAdditionalPayload,
  type AdditionalValues,
} from "../lib/additional";
import {
  REQUESTED_ROLE_OPTIONS,
  signupSchemaWithMatch,
  type SignupValues,
} from "../lib/schema";
import { useSignupMutation } from "../remote/use-signup";
import { AdditionalFieldsSection } from "./additional-fields-section";
import { Field } from "./field";
import { RadioCard } from "./radio-card";
import { SubmitButton } from "./submit-button";
import { TextInput } from "./text-input";

export const SignupForm = ({
  onSignedUp,
}: {
  onSignedUp: (token: string, additional: AdditionalValues) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchemaWithMatch),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ...EMPTY_ADDITIONAL,
    },
  });

  const signupMutation = useSignupMutation({
    mutation: {
      onError: (error: unknown) => {
        toast.error(extractMessage(error, "회원가입에 실패했습니다."));
      },
    },
  });

  const onSubmit = (values: SignupValues) => {
    const additional: AdditionalValues = {
      name: values.name ?? "",
      major: values.major ?? "",
      year: values.year ?? "",
      studentId: values.studentId ?? "",
      phoneNumber: values.phoneNumber ?? "",
    };

    signupMutation.mutate(
      {
        data: {
          email: values.email,
          password: values.password,
          passwordConfirm: values.confirmPassword,
          requestedRole: values.requestedRole,
          ...toAdditionalPayload(additional),
        },
      },
      {
        onSuccess: (res) => {
          toast.success("회원가입이 완료되었어요. 추가 정보를 입력해보세요.");
          onSignedUp(res.data.pendingToken, additional);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <Field label="이메일" required error={errors.email}>
        <TextInput
          type="email"
          placeholder="이메일 주소"
          invalid={!!errors.email}
          registration={register("email")}
        />
      </Field>

      <Field label="비밀번호" required error={errors.password}>
        <TextInput
          type="password"
          placeholder="비밀번호 (8자 이상, 숫자 포함)"
          invalid={!!errors.password}
          registration={register("password")}
        />
      </Field>

      <Field label="비밀번호 확인" required error={errors.confirmPassword}>
        <TextInput
          type="password"
          placeholder="비밀번호 확인"
          invalid={!!errors.confirmPassword}
          registration={register("confirmPassword")}
        />
      </Field>

      <Field label="회원 유형" required error={errors.requestedRole}>
        <div className="flex gap-3">
          {REQUESTED_ROLE_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              label={option.label}
              value={option.value}
              registration={register("requestedRole")}
            />
          ))}
        </div>
      </Field>

      <AdditionalFieldsSection
        register={register}
        errors={errors}
        hint="선택 항목이에요. 가입 후 승인 전까지 입력·수정할 수 있어요."
      />

      <div className="pt-2">
        <SubmitButton
          pending={signupMutation.isPending}
          pendingLabel="가입 중..."
        >
          회원가입
        </SubmitButton>
      </div>

      <p className="mt-4 text-center text-sm text-slate-800">
        이미 계정이 있으신가요?
        <br />
        <Link
          to={AUTH_PATHS.login}
          className="ml-1 font-medium text-slate-900 hover:underline"
        >
          로그인하기
        </Link>
      </p>
    </form>
  );
};
