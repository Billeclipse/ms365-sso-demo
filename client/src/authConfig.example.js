// Copy this file to authConfig.js and replace the placeholders with your Azure AD configuration.

export const msalConfig = {
  auth: {
    clientId: 'your-react-client-id',
    authority: 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: 'http://localhost:3001',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Define the scopes and API URI used in your app.
export const apiConfig = {
  scopes: ['api://your-api-client-id/api.read'],
  uri: 'http://localhost:3000',
};