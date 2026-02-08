import Loading from "@/components/common/Skeletons/Loading";
import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { queryClient } from "../shared/context/QueryClient";
import AppRouter from "./routers/AppRouter";

import "./index.css";

// Declare global type for SSR state
declare global {
  interface Window {
    __REACT_QUERY_STATE__?: any;
  }
}

const App = () => {
  // Hydrate the React Query cache from SSR
  useEffect(() => {
    if (window.__REACT_QUERY_STATE__) {
      hydrate(queryClient, window.__REACT_QUERY_STATE__);
      // Clean up the global state after hydration
      delete window.__REACT_QUERY_STATE__;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Suspense fallback={<Loading />}>
            <AppRouter />
          </Suspense>
        </BrowserRouter>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;
