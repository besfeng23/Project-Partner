import admin from 'firebase-admin';

// This is a server-only file.
// IMPORTANT: The service account key should be set as an environment variable in your deployment environment.
// DO NOT hardcode it here.
// On Vercel, this would be an environment variable like:
// FIREBASE_SERVICE_ACCOUNT_KEY = '{ "type": "service_account", ... }'

try {
  if (!admin.apps.length) {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error('Firebase Admin initialization error', error);
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
