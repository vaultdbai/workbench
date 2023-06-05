import React from "react";
import { createRoot } from "react-dom/client";
import App from "Containers/App";
import reportWebVitals from "./reportWebVitals";
import ThemeProvider from "@mui/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "themes/default_theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import AWS from "aws-sdk";
import ProfilePage from "Components/ProfilePage";

// Configure Amplify in index file or root file
Amplify.configure({
  Auth: {
    identityPoolId: window.USER_IDENTITY_POOL_ID,
    region: window.REGION,
    userPoolId: window.USER_POOL_ID,
    userPoolWebClientId: window.USER_POOL_APP_CLIENT_ID,
  },
  Storage: {
    AWSS3: {
      bucket: 'karan-test-public-storage-704448976973',
      region: window.REGION
    }
  }
});

AWS.config.region = window.REGION; // Region

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Router basename="/workbench">
        <Routes>
          <Route path="/" element={
            <Authenticator.Provider>
              <App />
            </Authenticator.Provider>
          } />
            <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
