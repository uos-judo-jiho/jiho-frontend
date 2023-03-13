import { Button, Checkbox, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { loginApi } from "../../../api/loginApi";
import useFetchData from "../../../Hooks/useFetchData";

type AdminLoginProps = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoginValuesType = {
  username: string;
  password: string;
};

function AdminLogin({ setIsLogin }: AdminLoginProps) {
  const [loginValues, setloginValues] = useState<LoginValuesType>();

  const { loading, error, response } = useFetchData(loginApi, loginValues);

  function onFinish(values: LoginValuesType) {
    setloginValues(values);
  }

  useEffect(() => {
    if (!loading && !error && response === "Accept Login") {
      console.log("Success:", response);
      setIsLogin(true);
    } else if (!loading && response != "Accept Login") {
      alert("사용자 이름과 비밀번호가 일치하지 않습니다.");
      onFinishFailed("사용자 이름과 비밀번호가 일치하지 않습니다.");
    }
  }, [response]);

  function onFinishFailed(errorInfo: any) {
    console.error("Failed:", errorInfo);
  }
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AdminLogin;
