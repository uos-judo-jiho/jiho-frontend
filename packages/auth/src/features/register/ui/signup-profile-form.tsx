import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_PATHS } from "#shared/config/paths";
import { extractMessage } from "#shared/lib/extract-message";
import {
  additionalSchema,
  EMPTY_ADDITIONAL,
  toAdditionalPayload,
  type AdditionalValues,
} from "../lib/additional";
import { useSignupProfileMutation } from "../remote/use-signup-profile";
import { AdditionalFieldsSection } from "./additional-fields-section";
import { SubmitButton } from "./submit-button";

export const SignupProfileForm = ({
  pendingToken,
  initialValues,
}: {
  pendingToken: string;
  initialValues: AdditionalValues;
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdditionalValues>({
    resolver: zodResolver(additionalSchema),
    defaultValues: { ...EMPTY_ADDITIONAL, ...initialValues },
  });

  const profileMutation = useSignupProfileMutation(pendingToken, {
    mutation: {
      onSuccess: () => toast.success("추가 정보를 저장했어요."),
      onError: (error: unknown) =>
        toast.error(
          extractMessage(
            error,
            "추가 정보 저장에 실패했어요. 토큰이 만료되었을 수 있어요.",
          ),
        ),
    },
  });

  const onSubmit = (values: AdditionalValues) => {
    profileMutation.mutate({ data: toAdditionalPayload(values) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <AdditionalFieldsSection
        register={register}
        errors={errors}
        hint="관리자 승인 전까지 언제든 다시 저장할 수 있어요."
      />

      <div className="space-y-3 pt-2">
        <SubmitButton
          pending={profileMutation.isPending}
          pendingLabel="저장 중..."
        >
          추가 정보 저장
        </SubmitButton>
        <button
          type="button"
          onClick={() => navigate(AUTH_PATHS.login)}
          className="h-11 w-full rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          나중에 입력하고 로그인하기
        </button>
      </div>
    </form>
  );
};
