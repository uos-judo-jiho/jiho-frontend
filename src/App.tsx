import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import { queryClient } from "./context/QueryClient";
import { GlobalStyle } from "./lib/theme/GlobalStyle";
import { darkTheme, lightTheme } from "./lib/theme/theme";
import AppRouter from "./routers/AppRouter";

import "./index.css";

const App = () => {
  // TODO: dark mode
  const [isDark] = useState(false);

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
