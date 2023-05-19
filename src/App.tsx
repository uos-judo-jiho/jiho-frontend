import { useState } from "react";
import { ThemeProvider } from "styled-components";
import AppRouter from "./routers/AppRouter";
import { GlobalStyle } from "./theme/GlobalStyle";
import { darkTheme, lightTheme } from "./theme/theme";
import useGoogleAnalytics from "./ga/googleAnalytics";
import { BrowserRouter } from "react-router-dom";
function App() {
  const [isDark, setIsDart] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
