import { QueryClientProvider, hydrate } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import { queryClient } from "./context/QueryClient";
import { GlobalStyle } from "./lib/theme/GlobalStyle";
import { darkTheme, lightTheme } from "./lib/theme/theme";
import AppRouter from "./routers/AppRouter";

import "./index.css";

// Declare global type for SSR state
declare global {
  interface Window {
    __REACT_QUERY_STATE__?: any;
  }
}

const App = () => {
  // TODO: dark mode
  const [isDark] = useState(false);

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
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <GlobalStyle />
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;
