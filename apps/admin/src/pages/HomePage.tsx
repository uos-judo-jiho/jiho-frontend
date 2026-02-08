import Router from "@/app/routers/Router";
import Login from "@/components/admin/form/Login";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import useSession from "@/recoils/session";

const HomePage = () => {
  const { session } = useSession();

  return (
    <DefaultLayout>
      {/* TODO: 로그인 기능 구현 */}
      {!session.isLogin ? (
        <SheetWrapper>
          <Router />
        </SheetWrapper>
      ) : (
        <Login />
      )}
    </DefaultLayout>
  );
};

export default HomePage;
