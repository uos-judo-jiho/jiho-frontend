import React, { useState } from "react";
import styled from "styled-components";
import { loginApi } from "../../../api/loginApi";

type AdminLoginProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoginValuesType = {
  username: string;
  password: string;
};

const FormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledInput = styled.input`
  &[type="text"],
  &[type="password"] {
    height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  &[type="submit"] {
    margin-top: 10px;
    cursor: pointer;
    font-size: 15px;
    background: #01d28e;
    border: 1px solid #01d28e;
    color: #fff;
    padding: 10px 20px;
  }

  &[type="submit"]:hover {
    background: #6cf0c2;
  }
`;

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
