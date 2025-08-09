import { RouterProvider } from "react-router-dom";
import router from "src/app/router";
import GlobalStyle from "src/shared/styles/globalStyle";
import { ThemeProvider } from "styled-components";
import { theme } from "src/shared/styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
