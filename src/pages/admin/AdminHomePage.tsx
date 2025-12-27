import AdminLogin from "@/components/admin/form/AdminLogin";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import useSession from "@/recoils/session";
import { useEffect, useState } from "react";
import AdminRouter from "../../app/routers/AdminRouter";

const AdminHomePage = () => {
  const [isClient, setIsClient] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <MyHelmet title="Admin" />
        <DefaultLayout>
          <SheetWrapper>
            <div>Loading...</div>
          </SheetWrapper>
        </DefaultLayout>
      </>
    );
  }

  return (
    <>
      <MyHelmet title="Admin" />
      <DefaultLayout>
        <SheetWrapper>
          {session.isLogin ? <AdminRouter /> : <AdminLogin />}
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
};

export default AdminHomePage;
