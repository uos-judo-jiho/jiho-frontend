import Router from "@/app/routers/Router";
import Login from "@/components/admin/form/Login";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { useState } from "react";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <DefaultLayout>
      {/* TODO: 로그인 기능 구현 */}
      {isAuthenticated ? (
        <SheetWrapper>
          <Router />
        </SheetWrapper>
      ) : (
        <Login onSuccess={() => setIsAuthenticated(true)} />
      )}
    </DefaultLayout>
  );
};

export default HomePage;
