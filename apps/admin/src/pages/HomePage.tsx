import Router from "@/app/routers/Router";
import Login from "@/components/admin/form/Login";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { v2Admin } from "@packages/api";

const HomePage = () => {
  const {
    data: adminProfile,
    isLoading,
    isSuccess,
    refetch,
  } = v2Admin.useGetApiV2AdminMe({
    query: {
      retry: false,
    },
    axios: {
      withCredentials: true,
    },
  });

  return (
    <DefaultLayout>
      {/* TODO: 로그인 기능 구현 */}
      {isLoading ? null : isSuccess && adminProfile?.data ? (
        <SheetWrapper>
          <Router />
        </SheetWrapper>
      ) : (
        <Login onSuccess={() => refetch()} />
      )}
    </DefaultLayout>
  );
};

export default HomePage;
