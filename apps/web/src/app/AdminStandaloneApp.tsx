import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import AdminHomePage from "@/pages/admin/AdminHomePage";
import { queryClient } from "../shared/context/QueryClient";

const AdminStandaloneApp = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.__REACT_QUERY_STATE__) {
      hydrate(queryClient, window.__REACT_QUERY_STATE__);
      delete window.__REACT_QUERY_STATE__;
    }
  }, []);

  const baseName =
    (import.meta.env.BASE_URL || "/admin/").replace(/\/$/, "") || "/";

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <BrowserRouter basename={baseName}>
          <AdminHomePage />
        </BrowserRouter>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default AdminStandaloneApp;
