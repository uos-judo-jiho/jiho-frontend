import { AuthRouter, PublicRouter } from "@/app/routers/Router";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { v2Admin } from "@packages/api";
import { useEffect, useState } from "react";

export const App = () => {
  const [refreshTried, setRefreshTried] = useState(false);

  const {
    data: adminProfile,
    isLoading,
    isSuccess,
    error,
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

  const isAuthorized = isSuccess && adminProfile?.data;

  return (
    <DefaultLayout showSidebar={!!isAuthorized}>
      {isLoading ? null : isAuthorized ? (
        <SheetWrapper>
          <AuthRouter />
        </SheetWrapper>
      ) : (
        <PublicRouter />
      )}
    </DefaultLayout>
  );
};
