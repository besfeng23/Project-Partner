import 'server-only';
import admin from 'firebase-admin';

// This is a server-only file.

/**
 * Loads the Firebase service account credentials safely.
 * It tries to load from a single JSON environment variable first,
 * then falls back to individual environment variables.
 * This function does not throw but returns a result object.
 */
function loadServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (rawJson && rawJson.trim()) {
    const sanitizedJson = rawJson.trim();
    try {
      // Vercel might wrap the variable in quotes, so we strip them.
      const unquoted =
        sanitizedJson.startsWith('"') && sanitizedJson.endsWith('"')
          ? sanitizedJson.slice(1, -1)
          : sanitizedJson;
      const parsed = JSON.parse(unquoted);

      // The private_key specifically needs newline characters to be correctly formatted.
      if (parsed?.private_key && typeof parsed.private_key === 'string') {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      return {ok: true, value: parsed};
    } catch (e: any) {
      return {
        ok: false,
        error: `Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON: ${e.message}`,
      };
    }
  }

  // Fallback to individual environment variables if the full JSON is not provided.
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Vercel might not handle multiline env vars well, so we allow `\n` to be used.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return {
      ok: true,
      value: {
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey,
      },
    };
  }

  // Return an error if no valid credentials are found.
  return {ok: false, error: 'Missing Firebase Admin credentials env vars.'};
}

let _app: admin.app.App | null = null;
let _initError: string | null = null;

/**
 * Lazily initializes and returns the Firebase Admin App instance.
 * Ensures that initialization only happens once.
 * Returns null if credentials are not configured correctly, preventing build-time crashes.
 */
function getAdminApp(): admin.app.App | null {
  if (admin.apps.length) {
    return admin.app();
  }

  if (_app) {
    return _app;
  }
  
  if (_initError) {
    // Avoid re-attempting initialization if it has already failed.
    console.error('Firebase Admin initialization previously failed:', _initError);
    return null;
  }

  const cred = loadServiceAccount();
  if (!cred.ok) {
    // Log the error during runtime, but don't throw during build.
    _initError = cred.error;
    console.error('Failed to load Firebase service account:', _initError);
    return null;
  }

  try {
    _app = admin.initializeApp({
      credential: admin.credential.cert(cred.value as admin.ServiceAccount),
    });
    return _app;
  } catch (e: any) {
    _initError = e.message;
    console.error('Failed to initialize Firebase Admin app:', _initError);
    return null;
  }
}

/**
 * Returns a Firestore instance from the lazily-initialized Admin App.
 * Returns null if the app cannot be initialized.
 */
export function getAdminDb(): admin.firestore.Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  return admin.firestore();
}

/**
 * Returns an Auth instance from the lazily-initialized Admin App.
 * Returns null if the app cannot be initialized.
 */
export function getAdminAuth(): admin.auth.Auth | null {
  const app = getAdminApp();
  if (!app) return null;
  return admin.auth();
}
