# MS365 SSO Proof‑of‑Concept Demo

This repository demonstrates how to implement Microsoft 365 single sign‑on (SSO) using the Microsoft identity platform (Azure Active Directory / Entra ID) in a full‑stack application.  It contains:

* **Server** – a Node.js/Express REST API backed by a MySQL database via Sequelize.  The API uses the `passport-azure-ad` Bearer Strategy to validate JWT access tokens issued by Azure AD and exposes a couple of protected endpoints.
* **React Client** – a single‑page web app built with React that uses the [Microsoft Authentication Library](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview) (`msal-browser` and `@azure/msal-react`) to sign users in and acquire tokens for the API.
* **UWP Client** – a sample Universal Windows Platform application showing how to authenticate with Azure AD from .NET using the `Microsoft.Identity.Client` library and call the protected API.

> **Note:**  Real authentication requires registering two applications in Azure AD: one for the API (server) and one for each client.  Placeholders in the configuration files (`.env.example`, React app configuration, and UWP sample) need to be replaced with your own **tenant ID**, **client ID**, **authority** and **scopes**.

## Prerequisites

* Docker Engine or Docker Desktop
* Node.js (for local development outside of Docker)
* An Azure AD tenant with permissions to register applications

## Running the demo with Docker

1.  Clone this repository and navigate into it.

    ```sh
    git clone <repo-url>
    cd ms365-sso-demo
    ```

2.  Copy the sample environment file and edit it with your database and Azure AD details:

    ```sh
    cp server/.env.example server/.env
    # edit server/.env to set AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_ID, AZURE_AD_API_AUDIENCE, etc.
    ```

3.  Build and run the containers.  Docker Compose will start both MySQL and the Node API.  The API listens on port `3000`.

    ```sh
    docker-compose up --build
    ```

4.  Use your browser or a tool like `curl`/Postman to test the API.  Without a valid JWT access token the protected endpoints (`/api/profile`, `/api/users`) will return **401 Unauthorized**.

5.  To obtain access tokens, configure the React or UWP client as described below, run the client, sign in with an Azure AD account, and let the client call the API.

## React client

The React app lives in the `client` folder.  It uses the [MSAL React](https://www.npmjs.com/package/@azure/msal-react) package to handle sign‑in and token acquisition.

1.  Navigate to the `client` directory and install dependencies.

    ```sh
    cd client
    npm install
    ```

2.  Copy the sample configuration and replace the placeholders with the **client ID** of your React application registration, the **tenant ID**, and the API scope (usually something like `api://<server‑client‑id>/access_as_user`).

    ```sh
    cp src/authConfig.example.js src/authConfig.js
    # edit src/authConfig.js accordingly
    ```

3.  Start the development server (use port `3001` if `3000` is taken by the API).

    ```sh
    npm start
    ```

4.  Click **Sign In**.  After authenticating with Azure AD, click **Get Users** to call the protected API using the acquired access token.

## UWP client

The UWP sample is located in the `uwpClient` folder.  It contains a simple `MainPage.xaml` and `MainPage.xaml.cs` demonstrating how to sign in with Azure AD using **MSAL** and call the API with the resulting access token.

To open it, import the project into Visual Studio 2019/2022 with UWP development tools installed.  Replace the placeholder values in `App.xaml.cs` with your client ID and tenant ID, then run the app.

---

This proof‑of‑concept is intentionally simple.  In production you should consider using a more robust API gateway, automatic token caching and renewal, error handling, and environment‑specific configuration.