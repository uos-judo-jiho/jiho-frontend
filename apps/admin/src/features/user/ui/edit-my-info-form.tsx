import { RouterUrl } from "@/app/routers/router-url";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledLabel,
} from "@/components/admin/form/StyledComponent/FormContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const editMyInfoSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  generation: z.number().min(1, "기수를 입력해주세요."),
  studentId: z.string().min(1, "학번을 입력해주세요."),
  major: z.string().min(1, "학과를 입력해주세요."),
  phoneNumber: z.string().min(1, "연락처를 입력해주세요."),
});

type EditMyInfoFormValues = z.infer<typeof editMyInfoSchema>;

export const EditMyInfoForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.user,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditMyInfoFormValues>({
    resolver: zodResolver(editMyInfoSchema),
    defaultValues: {
      name: user.additionalInfo?.name ?? "",
      generation: user.additionalInfo?.generation ?? 0,
      studentId: user.additionalInfo?.studentId ?? "",
      major: user.additionalInfo?.major ?? "",
      phoneNumber: user.additionalInfo?.phoneNumber ?? "",
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
          />
          {errors.generation && (
            <span className="text-xs text-red-500">
              {errors.generation.message}
            </span>
          )}
          <span className="text-sm text-neutral-500">
            기수는 숫자만 입력해주세요 (예: 8, 34)
          </span>
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="studentId">학번</StyledLabel>
          <Input
            id="studentId"
            {...register("studentId")}
            placeholder="학번을 입력하세요"
          />
          {errors.studentId && (
            <span className="text-xs text-red-500">
              {errors.studentId.message}
            </span>
          )}
          <span className="text-sm text-neutral-500">
            학번은 숫자만 입력해주세요 (예: 2026920001) <br />* 학번이 기억나지
            않는 경우, 입학년도를 작성해주세요 (예: 12)
          </span>
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="major">학과</StyledLabel>
          <Input
            id="major"
            {...register("major")}
            placeholder="학과를 입력하세요"
          />
          {errors.major && (
            <span className="text-xs text-red-500">{errors.major.message}</span>
          )}
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="phoneNumber">연락처</StyledLabel>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="연락처를 입력하세요"
          />
          {errors.phoneNumber && (
            <span className="text-xs text-red-500">
              {errors.phoneNumber.message}
            </span>
          )}
          <span className="text-sm text-neutral-500">
            연락처는 숫자만 입력해주세요 (예: 01012345678)
          </span>
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
