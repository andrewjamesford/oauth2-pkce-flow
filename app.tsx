import express, { type Request, type Response } from "express";
import axios from "axios";
import * as crypto from "crypto";
import * as nanoid from "nanoid";

const app = express();
app.use(express.json());

// Configuration for your OAuth 2.0 server
const clientId = "your_client_id";
const clientSecret = "your_client_secret"; // Not used in PKCE flow
const authorizationServerUrl = "https://your-auth-server.com";
const redirectUri = "http://localhost:3000/callback";
const scopes = "openid profile email";

// Function to generate a code verifier and challenge
function generateCodeVerifierAndChallenge(): [string, string] {
	const verifier = crypto
		.randomBytes(32)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
	const challenge = crypto
		.createHash("sha256")
		.update(verifier)
		.digest("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
	return [verifier, challenge];
}

// Generate code verifier and challenge for PKCE
const [codeVerifier, codeChallenge] = generateCodeVerifierAndChallenge();

// Redirect user to authorization server
app.get("/login", (req: Request, res: Response) => {
	const authorizationUrl = `${authorizationServerUrl}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
	res.redirect(authorizationUrl);
});

// Handle callback from authorization server
app.get("/callback", async (req: Request, res: Response) => {
	const authorizationCode = req.query.code as string;

	// Exchange authorization code for access token
	const tokenUrl = `${authorizationServerUrl}/oauth/token`;
	const tokenResponse = await axios.post(tokenUrl, {
		grant_type: "authorization_code",
		code: authorizationCode,
		redirect_uri: redirectUri,
		client_id: clientId,
		code_verifier: codeVerifier,
	});

	// Extract access token
	const accessToken = tokenResponse.data.access_token;

	// Use introspection endpoint to retrieve scopes (if supported)
	const introspectionUrl = `${authorizationServerUrl}/introspect`;
	const introspectionResponse = await axios.post(introspectionUrl, {
		token: accessToken,
	});

	// Extract scopes from response
	const scopes = introspectionResponse.data.scope;

	res.send(`Scopes: ${scopes}`);
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
