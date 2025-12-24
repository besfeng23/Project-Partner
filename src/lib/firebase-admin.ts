import 'server-only';
import admin from 'firebase-admin';

// This is a server-only file.

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', e);
      return null;
    }
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  return null;
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
