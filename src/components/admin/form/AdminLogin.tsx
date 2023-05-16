import React, { useState } from "react";
import { loginApi } from "../../../api/loginApi";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledInput,
} from "./StyledComponent/FormContainer";

type AdminLoginProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoginValuesType = {
  username: string;
  password: string;
};

function AdminLogin({ setIsLogin }: AdminLoginProps) {
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

    const res = await loginApi(loginValue);

    if (res === "Accept Login") {
      setIsLogin(true);
    }
  }
  return (
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
  );
}

export default AdminLogin;
