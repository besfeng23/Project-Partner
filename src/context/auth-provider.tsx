"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { AppError } from '@/components/app-error';
import { getFirebaseAuth, isFirebaseInitialized, requireFirebaseClients } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Ensure firebase is initialized before setting up the listener
      const auth = getFirebaseAuth();

      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUser(user);
          setLoading(false);
        },
        (error) => {
          console.error("Auth state error:", error);
          setError(error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      user.getIdToken().then(setIdToken);
    } else {
      setIdToken(null);
    }
  }, [user]);

  if (error) {
    return <AppError title="Authentication error" message={error.message} />;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, idToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
