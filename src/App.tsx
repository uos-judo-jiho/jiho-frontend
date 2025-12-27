import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AppRouter from "./routers/AppRouter";
import { queryClient } from "./shared/context/QueryClient";

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
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;
