import { AuthRouter, PublicRouter } from "@/app/routers/Router";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { v2Admin } from "@packages/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const App = () => {
  const [refreshTried, setRefreshTried] = useState(false);

  const navigation = useNavigate();

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
      refreshMutation.mutateAsync(undefined, {
        onError: (error) => {
          if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const redirectTo = encodeURIComponent(
              currentPath.includes("login") ? "/" : currentPath,
            );
            navigation(`/login?expired=true&redirectTo=${redirectTo}`, {
              replace: true,
            });
          }
        },
      });
    }
  }, [error?.status, isLoading, navigation, refreshMutation, refreshTried]);

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
