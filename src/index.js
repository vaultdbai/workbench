import React from "react";
import { createRoot } from "react-dom/client";
import App from "Containers/App";
import reportWebVitals from "./reportWebVitals";
import ThemeProvider from "@mui/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "themes/default_theme";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
