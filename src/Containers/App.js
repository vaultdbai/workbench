import { useCallback, useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import Home from "Containers/Home";

import "@aws-amplify/ui-react/styles.css";

function App() {
  const [authState, setAuthState] = useState();

  const handleSignIn = useCallback(async (cognitoUser) => {
    const idToken = cognitoUser?.signInUserSession?.idToken;

    if (!idToken) return;
    setAuthState({ authenticated: true });
  }, []);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        handleSignIn(user);
      })
      .catch(() => {
        setAuthState({ authenticated: false });
      });
  }, [handleSignIn]);

  const handleSignOut = () => {
    Auth.signOut().then(() => setAuthState({ authenticated: false }));
  };

  if (!authState) return null;

  return (
    <Authenticator
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
      onStateChange={(authState) => console.log(authState)}
      slot="sign-in"
      signUpAttributes={[]}
    >
      <Home />
    </Authenticator>
  );
}

export default App;
