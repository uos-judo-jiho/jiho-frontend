import AdminLogin from "../../components/admin/form/AdminLogin";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import useSession from "../../recoills/session";
import AdminRouter from "../../routers/AdminRouter";

function AdminHomePage() {
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
}

export default AdminHomePage;
