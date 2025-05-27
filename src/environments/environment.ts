export const environment = {
  production: true,
  baseUrl: 'http://localhost/Api_Catalogos/html/public/index.php',
  // baseUrl: 'http://localhost:80',
  auth: {
    clientId: 'd72569ba-95a4-4dd7-b0d2-f9d6d4d6a223', // Application (client) ID from the app registration
    authority:
      'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
    redirectUri: 'https://linkhub.uniminuto.edu/login',
    // redirectUri: 'http://localhost:4200/dashboard',
    // redirectUri: 'http://localhost:81/dashboard',
    postLogoutRedirectUri: 'https://linkhub.uniminuto.edu/login',
    // postLogoutRedirectUri: 'http://localhost:81/login'
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};
