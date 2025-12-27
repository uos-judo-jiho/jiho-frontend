import Title from "@/components/layouts/Title";
import { LoginValuesType } from "@/features/api/admin/login";
import useSession from "@/recoils/session";
import { Constants } from "@/shared/lib/constant";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledInput,
} from "./StyledComponent/FormContainer";

function AdminLogin() {
  const { login } = useSession();
  const [loginValue, setloginValue] = useState<LoginValuesType>({
    username: "",
    password: "",
  });

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setloginValue((prev) => {
      return { ...prev, username: event.target.value };
    });
  }
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setloginValue((prev) => {
      return { ...prev, password: event.target.value };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await login(loginValue);
  }
  return (
    <>
      <Title title={"관리자 로그인"} color={Constants.BLACK_COLOR} />
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <label htmlFor="uname">Username </label>
            <StyledInput
              id="uname"
              type="text"
              name="uname"
              onChange={handleUsernameChange}
              required
            />

            {/* {renderErrorMessage("uname")} */}
          </InputContainer>
          <InputContainer>
            <label htmlFor="password">Password </label>
            <StyledInput
              id="password"
              type="password"
              name="password"
              onChange={handlePasswordChange}
              required
            />

            {/* {renderErrorMessage("pass")} */}
          </InputContainer>
          <ButtonContainer>
            <StyledInput type="submit" />
          </ButtonContainer>
        </form>
      </FormContainer>
      <Link to={"/"}>
        <div className="text-center my-4 underline hover:opacity-60 transition-opacity">
          홈으로 돌아가기
        </div>
      </Link>
    </>
  );
}

export default AdminLogin;
