import { useLoginMutation } from "@/features/api/admin/hooks";
import { useState } from "react";

const Login = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ ...formState });
  };

  return (
    <div>
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>관리자 로그인</h1>
      <form onSubmit={handleSubmit} className="admin-input-form">
        <div id="username-wrapper" className="admin-input-wrapper">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={formState.email}
            onChange={(event) =>
              setFormState({
                ...formState,
                email: event.currentTarget.value,
              })
            }
            required={true}
          />
        </div>
        <div id="password-wrapper" className="admin-input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formState.password}
            onChange={(event) =>
              setFormState({
                ...formState,
                password: event.currentTarget.value,
              })
            }
            required={true}
          />
        </div>
        <button
          className="admin-login-button"
          type="submit"
          disabled={loginMutation.isPending}
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
