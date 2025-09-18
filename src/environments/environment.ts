export const environment = {
  production: true,
  baseUrl: 'https://apilinkhub.uniminuto.edu',
  URLApiFotografia: 'https://fotografias.uniminuto.edu',
  digibee: {
    url: 'https://uniminuto.api.digibee.io/pipeline/uniminuto/v1',
    key: 'ITnjVcrLWfYpY2B246EcrWO6Hln3LD7a',
  },
  auth: {
    clientId: '0a26838f-0dec-46b7-9e88-38d9cea317d0',
    authority:
      'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
    redirectUri: 'https://linkhub.uniminuto.edu/login',
    postLogoutRedirectUri: 'https://linkhub.uniminuto.edu/login',
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};
