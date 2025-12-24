"use client";

import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseClientError } from '@/lib/firebase';

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const firebaseInitError = getFirebaseClientError();
    const auth = getFirebaseAuth();

    if (firebaseInitError || !auth) {
      setAuthState({
        user: null,
        loading: false,
        error: firebaseInitError ?? new Error('Firebase Auth is not available.'),
      });
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: prev.error ?? new Error('Authentication timeout. Please reload.'),
      }));
    }, 10_000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({ user, loading: false, error: null });
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      },
      (error) => {
        setAuthState({ user: null, loading: false, error });
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    );

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return authState;
}
