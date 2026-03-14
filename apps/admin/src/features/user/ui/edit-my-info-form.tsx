import { RouterUrl } from "@/app/routers/router-url";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledLabel,
} from "@/components/admin/form/StyledComponent/FormContainer";
import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { v2Admin } from "@packages/api";
import { v2AdminModel } from "@packages/api/model";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const editMyInfoSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  generation: z
    .number()
    .min(1, "기수를 입력해주세요.")
    .max(100, "올바른 기수를 입력해주세요."),
  studentId: z.string().min(1, "학번을 입력해주세요."),
  major: z.string().min(1, "학과를 입력해주세요."),
  phoneNumber: z.string().min(1, "연락처를 입력해주세요."),
  graduationYear: z
    .number()
    .min(1987, "졸업 년도를 입력해주세요.")
    .max(2100, "올바른 졸업 년도를 입력해주세요.")
    .nullable(),
});

type EditMyInfoFormValues = z.infer<typeof editMyInfoSchema>;

export const EditMyInfoForm = () => {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <SkeletonItem className="h-10 w-full" />
          <SkeletonItem className="h-10 w-full" />
          <SkeletonItem className="h-10 w-full" />
        </div>
      }
    >
      <EditMyInfoFormWrapper />
    </Suspense>
  );
};

// 1. 폼의 실제 로직과 UI를 담당하는 내부 컴포넌트
const EditMyInfoFormInner = ({
  user,
}: {
  user: v2AdminModel.GetApiV2AdminMe200User;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initialValues = {
    name: user.additionalInfo?.name ?? "",
    generation: user.additionalInfo?.generation ?? 0,
    studentId: user.additionalInfo?.studentId ?? "",
    major: user.additionalInfo?.major ?? "",
    phoneNumber: user.additionalInfo?.phoneNumber ?? "",
    graduationYear: user.additionalInfo?.graduationYear ?? null,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditMyInfoFormValues>({
    resolver: zodResolver(editMyInfoSchema),
    values: initialValues,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const updateMe = v2Admin.usePutApiV2AdminMe({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () => {
        toast.success("내 정보가 수정되었습니다.");
        queryClient.invalidateQueries({
          queryKey: v2Admin.getGetApiV2AdminMeQueryKey(),
        });
        navigate(RouterUrl.마이페이지.루트);
      },
      onError: () => {
        toast.error("정보 수정에 실패했습니다.");
      },
    },
  });

  const onSubmit = (values: EditMyInfoFormValues) => {
    updateMe.mutate({
      data: values,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <InputContainer>
          <StyledLabel htmlFor="name">이름</StyledLabel>
          <Input
            id="name"
            {...register("name")}
            placeholder="이름을 입력하세요"
            defaultValue={initialValues.name}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="generation">기수</StyledLabel>
          <Input
            id="generation"
            type="number"
            {...register("generation", { valueAsNumber: true })}
            placeholder="기수를 입력하세요"
            defaultValue={initialValues.generation || ""}
          />
          {errors.generation != null ? (
            <span className="text-xs text-red-500">
              {errors.generation.message}
            </span>
          ) : (
            <span className="text-sm text-neutral-500">
              기수는 숫자만 입력해주세요 (예: 0, 1, 8, 34)
            </span>
          )}
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="studentId">학번</StyledLabel>
          <Input
            id="studentId"
            {...register("studentId")}
            placeholder="학번을 입력하세요"
            defaultValue={initialValues.studentId}
          />
          {errors.studentId != null ? (
            <span className="text-xs text-red-500">
              {errors.studentId.message}
            </span>
          ) : (
            <span className="text-sm text-neutral-500">
              학번은 숫자만 입력해주세요 (예: 2026920001) <br />* 학번이
              기억나지 않는 경우, 입학년도를 작성해주세요 (예: 12)
            </span>
          )}
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="major">학과</StyledLabel>
          <Input
            id="major"
            {...register("major")}
            placeholder="학과를 입력하세요"
            defaultValue={initialValues.major}
          />
          {errors.major != null ? (
            <span className="text-xs text-red-500">{errors.major.message}</span>
          ) : null}
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="phoneNumber">연락처</StyledLabel>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="연락처를 입력하세요"
            defaultValue={initialValues.phoneNumber}
          />
          {errors.phoneNumber != null ? (
            <span className="text-xs text-red-500">
              {errors.phoneNumber.message}
            </span>
          ) : (
            <span className="text-sm text-neutral-500">
              연락처는 숫자만 입력해주세요 (예: 01012345678)
            </span>
          )}
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="graduationYear">졸업 년도</StyledLabel>
          <Input
            id="graduationYear"
            type="number"
            {...register("graduationYear", { valueAsNumber: true })}
            placeholder="졸업 년도를 입력하세요"
            min={1987}
            max={2100}
            defaultValue={initialValues.graduationYear || ""}
          />
          {errors.graduationYear != null ? (
            <span className="text-xs text-red-500">
              {errors.graduationYear.message}
            </span>
          ) : (
            <span className="text-sm text-neutral-500">
              졸업 년도는 숫자만 입력해주세요 (예: 2025)
            </span>
          )}
        </InputContainer>
      </FormContainer>

      <ButtonContainer>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(RouterUrl.마이페이지.루트)}
        >
          취소
        </Button>
        <Button type="submit" disabled={updateMe.isPending}>
          {updateMe.isPending ? "저장 중..." : "저장하기"}
        </Button>
      </ButtonContainer>
    </form>
  );
};

// 2. 데이터를 가져오는 래퍼 컴포넌트
const EditMyInfoFormWrapper = () => {
  const { data: user } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.user,
    },
  });

  // 데이터가 없을 경우 가드
  if (!user) return null;

  return <EditMyInfoFormInner user={user} />;
};
