import App from "Containers/App";
import reportWebVitals from "./reportWebVitals";
import ThemeProvider from "@mui/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import * as ReactDOMClient from "react-dom/client";

import theme from "themes/default_theme";

const container = document.getElementById("root");

// Create a root.
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the root.
root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
