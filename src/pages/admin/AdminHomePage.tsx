import AdminLogin from "@/components/admin/form/AdminLogin";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import useSession from "@/recoils/session";
import AdminRouter from "../../routers/AdminRouter";

const AdminHomePage = () => {
  const { session } = useSession();

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
