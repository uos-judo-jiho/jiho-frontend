import { useState } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { store } from "./redux/store";

import AppRouter from "./routers/AppRouter";
import { GlobalStyle } from "./theme/GlobalStyle";
import { darkTheme, lightTheme } from "./theme/theme";

function App() {
  const [isDark, setIsDart] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <AppRouter />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
