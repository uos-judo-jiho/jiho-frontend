import Router from "@/app/routers/Router";
import Login from "@/components/admin/form/Login";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import MyHelmet from "@/features/seo/helmet/MyHelmet";
import useSession from "@/recoils/session";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [isClient, setIsClient] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <MyHelmet title="관리자" />
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
      <MyHelmet title="관리자" />
      <DefaultLayout>
        <SheetWrapper>{session.isLogin ? <Router /> : <Login />}</SheetWrapper>
      </DefaultLayout>
    </>
  );
};

export default HomePage;
