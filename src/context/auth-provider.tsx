"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { AppError } from '@/components/app-error';
import { useAuth as useFirebaseAuth } from '@/hooks/use-auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, error } = useFirebaseAuth();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setIdToken(null);
      setTokenError(null);
      return;
    }

    user
      .getIdToken()
      .then((token) => {
        if (isMounted) {
          setIdToken(token);
          setTokenError(null);
        }
      })
      .catch((tokenErr) => {
        if (isMounted) {
          setIdToken(null);
          setTokenError(tokenErr as Error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (error) {
    return <AppError title="Authentication error" message={error.message} />;
  }

  if (tokenError) {
    return <AppError title="Session error" message={tokenError.message} />;
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

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = () => {
  return useAuthContext();
};
