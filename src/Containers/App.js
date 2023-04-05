import Configration from "Configration";
import Home from "Containers/Home";
import ErrorBoundary from "Components/ErrorBoundary";
import { AppContextProvider } from "context/AppContext";
import { useCallback, useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

// Configure application
Configration.configure(
              window.APPLICATION_NAME, 
              window.REGION, 
              window.USER_POOL_ID, 
              window.USER_POOL_APP_CLIENT_ID, 
              window.USER_IDENTITY_POOL_ID);

function App() {

  const [authState, setAuthState] = useState();

  const handleSignIn = useCallback(cognitoUser => {
    const idToken = cognitoUser?.signInUserSession?.idToken;

    if (!idToken) return;

    Configration.setUserCredentials(idToken);
    setAuthState({ authenticated: true });

  }, []);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => handleSignIn(user))
      .catch(() => setAuthState({ authenticated: false }));
  }, [handleSignIn]);

  const handleSignOut = () => {
    Auth.signOut().then(() => setAuthState({ authenticated: false }));
  };

  if (!authState) return null;

  return (
    <div>
      {authState.authenticated ? (
        <ErrorBoundary>
          <AppContextProvider>
            <Home />
          </AppContextProvider>
        </ErrorBoundary>
      ) : (
        <Authenticator
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          slot="sign-in" hideSignUp
        />
      )}
    </div>
  );
}

export default App;
