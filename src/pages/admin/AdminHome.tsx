import { useState } from "react";
import FormContainer from "../../components/admin/FormContainer";
import TrainingLogForm from "../../components/admin/TrainingLogForm";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import AdminLogin from "./AdminLogin";

function AdminHome() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <DefaultLayout>
      <SheetWrapper>
        {isLogin ? (
          <FormContainer title="훈련일지 관리">
            <TrainingLogForm />
          </FormContainer>
        ) : (
          <AdminLogin setIsLogin={setIsLogin} />
        )}
      </SheetWrapper>
    </DefaultLayout>
  );
}

export default AdminHome;
