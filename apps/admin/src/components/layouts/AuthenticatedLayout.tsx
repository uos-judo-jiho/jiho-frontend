import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { RouterUrl } from "@/app/routers/router-url";
import DefaultLayout from "./DefaultLayout";
import SheetWrapper from "./SheetWrapper";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { pathname } = useLocation();
  const fullpageRoot = RouterUrl.영상.풀페이지.목록;
  const isFullpageRoute =
    pathname === fullpageRoot || pathname.startsWith(`${fullpageRoot}/`);

  return (
    <DefaultLayout showSidebar={!isFullpageRoute}>
      {isFullpageRoute ? children : <SheetWrapper>{children}</SheetWrapper>}
    </DefaultLayout>
  );
};
