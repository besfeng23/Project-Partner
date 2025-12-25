
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { AppError } from '@/components/app-error';
import { getFirebaseAuth, isFirebaseInitialized, requireFirebaseClients } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to manage the auth cookie
const setAuthCookie = (token: string | null) => {
  if (token) {
    document.cookie = `idToken=${token}; path=/; max-age=3600`; // max-age 1 hour
  } else {
    document.cookie = 'idToken=; path=/; max-age=-1;'; // Expire the cookie
  }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();

      // Listen for ID token changes to set the cookie for the middleware
      const unsubscribeIdToken = onIdTokenChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          setIdToken(token);
          setAuthCookie(token);
        } else {
          setIdToken(null);
          setAuthCookie(null);
        }
      });
      
      // Listen for user state changes for the app's context
      const unsubscribeAuthState = onAuthStateChanged(
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

      return () => {
        unsubscribeIdToken();
        unsubscribeAuthState();
      };
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }, []);


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
