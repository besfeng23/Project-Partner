"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseClientError, isFirebaseInitialized } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const firebaseInitError = getFirebaseClientError();
    if (firebaseInitError) {
      setAuthState({ user: null, loading: false, error: firebaseInitError });
      return;
    }

    if (!isFirebaseInitialized()) {
      // Firebase is not ready yet, wait for the next render.
      // The initializer runs in client.ts, and a re-render will be triggered.
      return;
    }
    
    const auth = getFirebaseAuth();
    if (!auth) {
       setAuthState({ user: null, loading: false, error: new Error("Firebase Auth is not available.") });
       return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({ user, loading: false, error: null });
      },
      (error) => {
        setAuthState({ user: null, loading: false, error });
      }
    );

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs until firebase is initialized

  return authState;
}
