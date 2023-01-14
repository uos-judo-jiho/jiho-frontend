import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Home from "./pages/Home";
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
