import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
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
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
