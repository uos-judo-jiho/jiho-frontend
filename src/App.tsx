import { useState } from "react";
import { ThemeProvider } from "styled-components";
import AppRouter from "./routers/AppRouter";
import { GlobalStyle } from "./theme/GlobalStyle";
import { darkTheme, lightTheme } from "./theme/theme";

function App() {
  const [isDark, setIsDart] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
