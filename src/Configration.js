import { Amplify } from 'aws-amplify';
import AWS from 'aws-sdk';

const Configration = (function() {
  var application = "";
  var userPoolId = "";
  var identityPoolId = "";
  var user = { jwt: ""};

  var getName = function() {
    return application;    // Or pull this from cookie/localStorage
  };

  var getToken = function() {
    return user.jwt;    // return jwt token
  };

  var configure = function(name, region, poolid, clientid, identity_pool) {
    application = name;
    userPoolId = poolid;
    identityPoolId = identity_pool;
    // Configure Amplify in index file or root file
    Amplify.configure({
      Auth: {
          region: region,
          userPoolId: poolid,
          userPoolWebClientId: clientid
      }
    });

    AWS.config.region = region; // Region

  };

  var setUserCredentials = function(idToken) {
    user = {
      jwt: idToken.jwtToken,
      sub: idToken.payload.sub,
      name: idToken.payload.name,
      email: idToken.payload.email,
    };
  
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: {
        [`cognito-idp.${AWS.config.region}.amazonaws.com/${userPoolId}`]: idToken.jwtToken
      },
    });    
  };

  return {
    getName: getName,
    getToken: getToken,
    configure: configure,
    setUserCredentials
  };  
})();

export default Configration;