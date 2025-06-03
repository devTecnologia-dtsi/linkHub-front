export const environment = {
  production: true,
  // baseUrl: 'http://localhost/Api_Catalogos/html/public/index.php',
  // baseUrl: 'http://localhost:8084',
  baseUrl: 'http://10.0.26.31:8084',
  auth: {
    clientId: '0a26838f-0dec-46b7-9e88-38d9cea317d0',
    authority:
      'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
    redirectUri: 'https://linkhub.uniminuto.edu/login',
    // redirectUri: 'http://localhost:4200/login',
    // redirectUri: 'http://10.0.26.31:8083/login',
    postLogoutRedirectUri: 'https://linkhub.uniminuto.edu/login',
    // postLogoutRedirectUri: 'http://10.0.26.31:8083/login',
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};
