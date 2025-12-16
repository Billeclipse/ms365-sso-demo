import React from 'react';
import { createRoot } from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import App from './App';
import { msalConfig } from './authConfig';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);