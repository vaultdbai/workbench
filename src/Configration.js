import { Amplify } from "aws-amplify";
import AWS from "aws-sdk";

const Configration = (function () {
  var application = "";
  var user_bucket = "";
  var userPoolId = "";
  var identityPoolId = "";
  var selectedCatalog = "test";
  var selectedSchema = "test";
  var user = { jwt: "" };

  var getName = function () {
    return application; // Or pull this from cookie/localStorage
  };

  var getUserBucket = function () {
    return user_bucket; // Or pull this from cookie/localStorage
  };

  var getToken = function () {
    return user.jwt; // return jwt token
  };

  var setCatalog = function (catalog) {
    selectedCatalog = catalog; // return database catalog
  };

  var setSchema = function (schema) {
    selectedSchema = schema; // return database schema
  };

  var getCatalog = function () {
    return selectedCatalog; // return database catalog
  };

  var getSchema = function () {
    return selectedSchema; // return database schema
  };

  var configure = function (name, region, poolid, clientid, identity_pool, user_bucket_name) {
    application = name;
    userPoolId = poolid;
    identityPoolId = identity_pool;
    user_bucket = user_bucket_name;
    // Configure Amplify in index file or root file
    Amplify.configure({
      Auth: {
        region: region,
        userPoolId: poolid,
        userPoolWebClientId: clientid,
      },
      Storage: {
        AWSS3: {
          bucket: window.USER_BUCKET,
          region: window.REGION
        }
      }
    });

    AWS.config.region = region; // Region
  };

  var setUserCredentials = function (idToken) {
    user = {
      jwt: idToken.jwtToken,
      sub: idToken.payload.sub,
      name: idToken.payload.name,
      email: idToken.payload.email,
    };

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: {
        [`cognito-idp.${AWS.config.region}.amazonaws.com/${userPoolId}`]:
          idToken.jwtToken,
      },
    });
  };

  return {
    getCatalog: getCatalog,
    getSchema: getSchema,
    getName: getName,
    getUserBucket: getUserBucket,
    getToken: getToken,
    configure: configure,
    setCatalog,
    setSchema,
    setUserCredentials,
  };
})();

export default Configration;
