import { RouterUrl } from "@/app/routers/router-url";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledLabel,
} from "@/components/admin/form/StyledComponent/FormContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const EditMyInfoForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.user,
    },
  });

  const [values, setValues] = useState({
    name: user.additionalInfo?.name ?? "",
    generation: user.additionalInfo?.generation ?? 0,
    studentId: user.additionalInfo?.studentId ?? "",
    major: user.additionalInfo?.major ?? "",
    phoneNumber: user.additionalInfo?.phoneNumber ?? "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMe.mutate({
      data: {
        ...values,
        generation: values.generation ? Number(values.generation) : undefined,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormContainer>
        <InputContainer>
          <StyledLabel htmlFor="name">이름</StyledLabel>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
          />
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="generation">기수</StyledLabel>
          <Input
            id="generation"
            name="generation"
            type="number"
            value={values.generation || ""}
            onChange={handleChange}
            placeholder="기수를 입력하세요"
          />
          <span className="text-sm text-neutral-500">
            기수는 숫자만 입력해주세요 (예: 8, 34)
          </span>
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="studentId">학번</StyledLabel>
          <Input
            id="studentId"
            name="studentId"
            value={values.studentId}
            onChange={handleChange}
            placeholder="학번을 입력하세요"
          />
          <span className="text-sm text-neutral-500">
            학번은 숫자만 입력해주세요 (예: 2026920001) <br />* 학번이 기억나지
            않는 경우, 입학년도를 작성해주세요 (예: 12)
          </span>
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="major">학과</StyledLabel>
          <Input
            id="major"
            name="major"
            value={values.major}
            onChange={handleChange}
            placeholder="학과를 입력하세요"
          />
        </InputContainer>

        <InputContainer>
          <StyledLabel htmlFor="phoneNumber">연락처</StyledLabel>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            placeholder="연락처를 입력하세요"
          />
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
