import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let app: App | undefined;
let auth: Auth | undefined;

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    // In production, use service account key
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      // For development, using application default credentials
      console.warn("Firebase Admin not initialized - missing service account key");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
} else {
  app = getApps()[0];
}

if (app) {
  auth = getAuth(app);
}

/**
 * Verify Firebase ID token and return the decoded token
 */
export async function verifyIdToken(idToken: string) {
  if (!auth) {
    throw new Error("Firebase Admin not initialized");
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new Error("Invalid ID token");
  }
}

/**
 * Extract and verify Firebase ID token from Authorization header
 */
export async function verifyAuthHeader(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const idToken = authHeader.split("Bearer ")[1];
  return verifyIdToken(idToken);
}

export { auth as adminAuth };
export default app;