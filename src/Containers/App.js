import Configration from "Configration";
import Home from "Containers/Home";
import ErrorBoundary from "Components/ErrorBoundary";
import { AppContextProvider } from "context/AppContext";
import { useCallback, useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getTablesMetaData } from "utils/vaultdb";

import "@aws-amplify/ui-react/styles.css";
import PageNotFound from "Components/PageNotFound";

// Configure application
Configration.configure(
  window.APPLICATION_NAME,
  window.REGION,
  window.USER_POOL_ID,
  window.USER_POOL_APP_CLIENT_ID,
  window.USER_IDENTITY_POOL_ID
);

function App() {
  const [authState, setAuthState] = useState();

  const [metaDataState, setMetaDataState] = useState({});

  const navigate = useNavigate();

  const handleSignIn = useCallback(async (cognitoUser) => {
    const idToken = cognitoUser?.signInUserSession?.idToken;

    if (!idToken) return;
    console.log(idToken);
    Configration.setUserCredentials(idToken);
    setAuthState({ authenticated: true });
    setMetaDataState(await getTablesMetaData());
  }, []);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        handleSignIn(user);
      })
      .catch(() => {
        setAuthState({ authenticated: false });
        navigate("/");
      });
  }, [handleSignIn]);

  const handleSignOut = () => {
    Auth.signOut().then(() => setAuthState({ authenticated: false }));
    navigate("/");
  };

  if (!authState) return null;

  return (
    <div>
      <ErrorBoundary>
        <AppContextProvider
          value={{
            tablesData: metaDataState,
          }}
        >
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Authenticator
                  onSignIn={handleSignIn}
                  onSignOut={handleSignOut}
                  onStateChange={(authState) => console.log(authState)}
                  slot="sign-in"
                  hideSignUp
                >
                  <Home />
                </Authenticator>
              }
            />
            <Route element={<PageNotFound />} />
          </Routes>
        </AppContextProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
