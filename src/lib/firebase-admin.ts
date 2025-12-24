import 'server-only';
import admin from 'firebase-admin';

// This is a server-only file.

function loadServiceAccount() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!rawServiceAccount) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not set.');
    return null;
  }

  try {
    const parsed = JSON.parse(rawServiceAccount);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', e);
    return null;
  }
}

function initializeAdminApp() {
  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    console.error(
      'Firebase Admin credentials not found in environment variables.'
    );
    return null;
  }
  
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.stack);
    return null;
  }
}

const adminApp = initializeAdminApp();

export function getAdminDb() {
  if (!adminApp) return null;
  return admin.firestore();
}

export function getAdminAuth() {
  if (!adminApp) return null;
  return admin.auth();
}

export async function verifyIdToken(idToken: string) {
    const auth = getAdminAuth();
    if (!auth) {
        throw new Error("Firebase Admin Auth not initialized.");
    }
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying ID token:", error);
        return null;
    }
}
