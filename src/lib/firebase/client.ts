import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

interface FirebaseClients {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

let clients: FirebaseClients | null = null;
let initError: Error | null = null;

const firebaseConfig = {
  apiKey: "AIzaSyCG0-VRD83KgcriAE1hmAPkj23SI220XSI",
  authDomain: "studio-4392536114-4d72f.firebaseapp.com",
  projectId: "studio-4392536114-4d72f",
  storageBucket: "studio-4392536114-4d72f.appspot.com",
  messagingSenderId: "678045416702",
  appId: "1:678045416702:web:96597678802f19042cb9af"
};

function initializeFirebase(): FirebaseClients {
  if (clients) {
    return clients;
  }

  if (initError) {
    throw initError;
  }

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    clients = { app, auth, db, storage };
    return clients;
  } catch (error) {
    initError = error as Error;
    throw initError;
  }
}

// These getters are now the primary way to access Firebase services.
// They ensure that initialization has been attempted.

export function getFirebaseClients(): FirebaseClients {
  return requireFirebaseClients();
}

export function getFirebaseClientError(): Error | null {
  return initError;
}

export function requireFirebaseClients(): FirebaseClients {
  if (!clients) {
    return initializeFirebase();
  }
  if (initError) {
    throw initError;
  }
  return clients;
}

export function getFirebaseAuth(): Auth {
  return requireFirebaseClients().auth;
}

export function getFirebaseDb(): Firestore {
  return requireFirebaseClients().db;
}

export function getFirebaseStorage(): FirebaseStorage {
  return requireFirebaseClients().storage;
}

export function getFirebaseApp(): FirebaseApp {
  return requireFirebaseClients().app;
}

export const isFirebaseInitialized = () => clients !== null && initError === null;
