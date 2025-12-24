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

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing Firebase env var: ${name}`);
  }
  return value;
}

function buildConfig(): FirebaseOptions {
  const config: FirebaseOptions = {
    apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
  };

  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  if (measurementId) {
    config.measurementId = measurementId;
  }

  return config;
}

function initializeFirebase() {
  if (clients || initError) return;

  try {
    const config = buildConfig();
    const app = !getApps().length ? initializeApp(config) : getApp();
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
          console.error('Firebase Emulator connection error:', emulatorError);
        }
      }
    }

    clients = { app, auth, db, storage };
  } catch (error) {
    initError = error as Error;
    console.error('Failed to initialize Firebase client:', initError.message);
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
