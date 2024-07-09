const {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} = require("amazon-cognito-identity-js");

const Username = "sahilmetalwala@gmail.com";
const Password = "Smodge420";
const UserPoolId = "us-east-2_ghlOXVLi1";
const ClientId = "4qte47jbstod8apnfic0bunmrq"; // Your App client id (add via Console->Cognito User Pool)


const getToken = async () => {
  const userPool = getUserPool();
  const cognitoUser = getCognitoUser(userPool);
  const authenticationDetails = getAuthenticationDetails();

  return new Promise((resolve) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        const token = result.getIdToken().getJwtToken();
        console.log(token);
        resolve(token);
      },
      onFailure: function (err) {
        console.log("error is ", JSON.stringify(err));
        console.log(err);
        resolve(null);
      },
    });
  });
};

const getUserPool = () => {
  const poolData = {
    UserPoolId: UserPoolId,
    ClientId: ClientId, // Your App client id here
  };
  const userPool = new CognitoUserPool(poolData);
  // console.log(userPool)
  return userPool;
};

const getCognitoUser = (userPool) => {
  const userParams = {
    Pool: userPool,
    Username: Username,
  };
  const cognitoUser = new CognitoUser(userParams);
  // console.log(cognitoUser)
  return cognitoUser;
};

const getAuthenticationDetails = () => {
  const authenticationData = {
    Username: Username,
    Password: Password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  // console.log(authenticationData)
  return authenticationDetails;
};
// getToken();

export default getToken;
