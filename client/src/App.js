import React, { useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { apiConfig } from './authConfig';

/**
 * Main application component for the React client.
 * Provides sign‑in/out controls and a button to call the protected API.
 */
function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [apiResponse, setApiResponse] = useState(null);

  const handleLogin = async () => {
    try {
      await instance.loginPopup({
        scopes: apiConfig.scopes,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const callApi = async () => {
    try {
      const account = accounts[0];
      const response = await instance.acquireTokenSilent({
        scopes: apiConfig.scopes,
        account,
      });
      const token = response.accessToken;
      const res = await fetch(`${apiConfig.uri}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setApiResponse(data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
      <h1>MS365 SSO Demo – React Client</h1>
      {!isAuthenticated ? (
        <button onClick={handleLogin}>Sign In</button>
      ) : (
        <button onClick={handleLogout}>Sign Out</button>
      )}
      {isAuthenticated && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={callApi}>Get Users</button>
          {apiResponse && (
            <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem' }}>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;