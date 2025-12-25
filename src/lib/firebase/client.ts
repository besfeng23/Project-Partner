import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, type FirebaseStorage, connectStorageEmulator } from 'firebase/storage';

interface FirebaseClients {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

let clients: FirebaseClients | null = null;
let initError: Error | null = null;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG0-VRD83KgcriAE1hmAPkj23SI220XSI",
  authDomain: "studio-4392536114-4d72f.firebaseapp.com",
  projectId: "studio-4392536114-4d72f",
  storageBucket: "studio-4392536114-4d72f.appspot.com",
  messagingSenderId: "678045416702",
  appId: "1:678045416702:web:96597678802f19042cb9af"
};

function initializeFirebase() {
  if (clients || initError) return;

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      if (!(window as any).__firebaseEmulatorConnected__) {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectStorageEmulator(storage, 'localhost', 9199);
          (window as any).__firebaseEmulatorConnected__ = true;
        } catch (emulatorError) {
          // This might fail if the emulators aren't running, which is fine.
          // We don't want to spam the console in that case.
        }
      }
    }

    clients = { app, auth, db, storage };
  } catch (error) {
    initError = error as Error;
    // The FirebaseConfigChecker component will show a UI error, so this console log is redundant.
  }
}

export function getFirebaseClients(): FirebaseClients | null {
  initializeFirebase();
  return clients;
}

export function getFirebaseClientError(): Error | null {
  initializeFirebase();
  return initError;
}

export function requireFirebaseClients(): FirebaseClients {
  initializeFirebase();
  if (initError) {
    throw initError;
  }
  if (!clients) {
    throw new Error('Firebase client is not available.');
  }
  return clients;
}

export function getFirebaseAuth(): Auth | null {
  return getFirebaseClients()?.auth ?? null;
}

export function getFirebaseDb(): Firestore | null {
  return getFirebaseClients()?.db ?? null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  return getFirebaseClients()?.storage ?? null;
}

export function getFirebaseApp(): FirebaseApp | null {
  return getFirebaseClients()?.app ?? null;
}

export const isFirebaseInitialized = () => clients !== null && initError === null;
