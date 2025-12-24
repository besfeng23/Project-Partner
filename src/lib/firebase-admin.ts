import 'server-only';
import admin from 'firebase-admin';

// This is a server-only file.

<<<<<<< HEAD
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
=======
let adminApp: admin.app.App | null = null;
let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    adminApp = admin.app();
  } else {
    const serviceAccount = loadServiceAccount();
    if (serviceAccount) {
      try {
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (error: any) {
        console.error('Firebase Admin initialization error:', error.stack);
      }
    } else {
      console.error(
        'Firebase Admin credentials not found. Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables.'
      );
>>>>>>> cd12ddf (then?)
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', e);
    return null;
  }
<<<<<<< HEAD
=======

  if (adminApp) {
    adminAuth = admin.auth(adminApp);
    adminDb = admin.firestore(adminApp);
  }
}

function loadServiceAccount() {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    }
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
  }
  return null;
>>>>>>> cd12ddf (then?)
}

initializeAdminApp();

export { adminApp, adminAuth, adminDb };

export async function verifyIdToken(idToken: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth not initialized.');
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}
