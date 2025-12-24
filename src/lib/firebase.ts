import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Check for a custom global flag to avoid reconnecting on every hot reload
    if (!(window as any).__firebaseEmulatorConnected__) {
        console.log("Connecting to Firebase Emulators");
        try {
            connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
            connectFirestoreEmulator(db, "localhost", 8080);
            connectStorageEmulator(storage, "localhost", 9199);
            (window as any).__firebaseEmulatorConnected__ = true;
        } catch (error) {
            console.error("Firebase Emulator connection error:", error);
        }
    }
}


export { app, auth, db, storage };
