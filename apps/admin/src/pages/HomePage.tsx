import Router from "@/app/routers/Router";
import Login from "@/components/admin/form/Login";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { v2Admin } from "@packages/api";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [refreshTried, setRefreshTried] = useState(false);

  const {
    data: adminProfile,
    isLoading,
    isSuccess,
    error,
    refetch,
  } = v2Admin.useGetApiV2AdminMe({
    query: { retry: false },
    axios: { withCredentials: true },
  });

  const refreshMutation = v2Admin.usePostApiV2AdminRefresh();

  useEffect(() => {
    if (isLoading || refreshTried) return;
    if (error?.status === 401) {
      setRefreshTried(true);
      refreshMutation.mutateAsync(undefined, {});
    }
  }, [error?.status, isLoading, refreshMutation, refreshTried]);

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
