import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import AppRouter from "./routers/AppRouter";
import { GlobalStyle } from "./theme/GlobalStyle";
import { darkTheme, lightTheme } from "./theme/theme";

const App = () => {
  // TODO: dark mode
  const [isDark] = useState(false);

  return (
    <RecoilRoot>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
