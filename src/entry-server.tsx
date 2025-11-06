import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { queryClient } from "./context/QueryClient";
import AppRouter from "./routers/AppRouter";
import { lightTheme } from "./lib/theme/theme";

export function render(url: string) {
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={lightTheme}>
          <StaticRouter location={url}>
            <AppRouter />
          </StaticRouter>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}