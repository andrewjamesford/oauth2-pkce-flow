# OAuth2 PKCE Flow POC

This project demonstrates an implementation of the OAuth2 Authorization Code Flow with Proof Key for Code Exchange (PKCE).

## Overview

- Implements OAuth2 Authorization Code Flow with PKCE.
- Provides secure authentication for client applications.
- Uses modern best practices for handling OAuth2 flows.

## Prerequisites

- Node.js (v14 or above)
- npm or yarn
- A configured OAuth2 provider

## Project Setup

```bash
npm install express typescript @types/express @types/node crypto axios
```

```bash
npx tsc --init
```

### Explanation

1. **Setup Express Server**: The code sets up an Express server that listens on port 3000.
2. **PKCE Flow**:
   - **Login Route (`/login`)**: Redirects the user to the authorization server with the necessary parameters for the Authorization Code Flow with PKCE.
   - **Callback Route (`/callback`)**: Handles the redirect back from the authorization server, exchanges the authorization code for an access token, and uses the introspection endpoint to retrieve the scopes associated with the access token.
3. **Scopes Retrieval**: After obtaining the access token, the code uses the introspection endpoint to retrieve the scopes. This step requires the authorization server to support token introspection.

### Running the Example

1. Replace placeholders (`your_client_id`, `your_client_secret`, `https://your-auth-server.com`) with your actual OAuth 2.0 server details.
2. Compile TypeScript:
   ```bash
   npx tsc
   ```
3. Run the compiled JavaScript:
   ```bash
   node app.js
   ```

This setup demonstrates how to handle the OAuth 2.0 PKCE flow and retrieve scopes from an access token using an authorization server's introspection endpoint.
