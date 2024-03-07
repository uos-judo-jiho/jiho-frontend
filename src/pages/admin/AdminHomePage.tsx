import { useState } from "react";
import AdminLogin from "../../components/admin/form/AdminLogin";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import AdminRouter from "../../routers/AdminRouter";

function AdminHomePage() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <>
      <MyHelmet helmet="Admin" />
      <DefaultLayout>
        <SheetWrapper>
          {!isLogin ? <AdminRouter /> : <AdminLogin setIsLogin={setIsLogin} />}
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default AdminHomePage;
