import { useState } from "react";

import { EMPTY_ADDITIONAL, type AdditionalValues } from "../lib/additional";
import { AuthShell } from "./auth-shell";
import { SignupForm } from "./signup-form";
import { SignupProfileForm } from "./signup-profile-form";

export const Register = () => {
  // 가입 성공 후 받은 임시 토큰(살아있는 동안 추가정보 반복 갱신 가능)
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  // 가입 폼에서 입력한 추가정보를 승인 전 입력 화면의 기본값으로 넘긴다.
  const [initialAdditional, setInitialAdditional] =
    useState<AdditionalValues>(EMPTY_ADDITIONAL);

  return (
    <AuthShell
      title={pendingToken ? "추가 정보 입력" : "회원가입"}
      description={
        pendingToken
          ? "관리자 승인 전까지 추가 정보를 입력·수정할 수 있어요."
          : "회원가입 후 서비스를 이용할 수 있어요."
      }
    >
      {pendingToken ? (
        <SignupProfileForm
          pendingToken={pendingToken}
          initialValues={initialAdditional}
        />
      ) : (
        <SignupForm
          onSignedUp={(token, additional) => {
            setInitialAdditional(additional);
            setPendingToken(token);
          }}
        />
      )}
    </AuthShell>
  );
};
