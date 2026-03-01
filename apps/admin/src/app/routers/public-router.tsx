import { WithHelmet } from "@/components/utils/with-helmet";
import { LoginPage } from "@/pages/login-page";
import { Register } from "@/pages/register-page";
import { Route, Routes } from "react-router-dom";
import { RouterUrl } from "./router-url";

export const PublicRouter = () => {
  return (
    <Routes>
      <Route
        path={RouterUrl.홈}
        element={WithHelmet(<LoginPage />, "로그인")}
      />
      <Route
        path={RouterUrl.로그인}
        element={WithHelmet(<LoginPage />, "로그인")}
      />
      <Route
        path={RouterUrl.회원가입}
        element={WithHelmet(<Register />, "회원가입")}
      />
    </Routes>
  );
};
