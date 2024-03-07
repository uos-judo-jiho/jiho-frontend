import React, { useState } from "react";
import { login } from "../../../api/login";
import {
  ButtonContainer,
  FormContainer,
  InputContainer,
  StyledInput,
} from "./StyledComponent/FormContainer";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Title from "../../../layouts/Title";
import { Constants } from "../../../constant/constant";

type AdminLoginProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoginValuesType = {
  username: string;
  password: string;
};

const BackDescription = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
  text-align: center;
  margin: 1rem 0;
  text-decoration-line: underline;

  &:hover {
    opacity: 0.6;
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

    const res = await login(loginValue);

    if (res === "Accept Login") {
      setIsLogin(true);
    } else {
      alert("로그인에 실패하였습니다.");
    }
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
        <BackDescription>홈으로 돌아가기</BackDescription>
      </Link>
    </>
  );
}

export default AdminLogin;
