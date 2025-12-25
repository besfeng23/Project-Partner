import 'server-only';
import admin from 'firebase-admin';

// This is a server-only file.

let adminApp: admin.app.App | null = null;
let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;
let adminInitError: Error | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    if (!adminApp) {
      adminApp = admin.app();
      adminAuth = admin.auth(adminApp);
      adminDb = admin.firestore(adminApp);
    }
    return;
  }

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!rawServiceAccount) {
    const err =
      'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK cannot be initialized.';
    console.error(err);
    adminInitError = new Error(err);
    return;
  }

  try {
    const serviceAccount = JSON.parse(rawServiceAccount);
    // The private_key needs to have newlines restored.
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        '\n'
      );
    }

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    adminAuth = admin.auth(adminApp);
    adminDb = admin.firestore(adminApp);
  } catch (e: any) {
    const err = 'Failed to parse or initialize Firebase Admin SDK.';
    console.error(err, e);
    adminInitError = new Error(err, { cause: e });
  }
}

// Initialize on module load.
initializeAdminApp();

export function getAdminApp() {
  if (adminInitError) throw adminInitError;
  return adminApp;
}

export function getAdminAuth() {
  if (adminInitError) throw adminInitError;
  return adminAuth;
}

export function getAdminDb() {
  if (adminInitError) throw adminInitError;
  return adminDb;
}

export async function verifyIdToken(idToken: string) {
  const auth = getAdminAuth();
  if (!auth) {
    throw new Error('Firebase Admin Auth not initialized.');
  }
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    // Re-throw or handle as a specific unauthorized error
    throw new Error('Invalid or expired token.');
  }
}
