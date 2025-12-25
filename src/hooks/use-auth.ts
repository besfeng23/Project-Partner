"use client";

// This hook is now deprecated in favor of using the AuthContext directly.
// The logic has been moved into the AuthProvider for a more robust initialization flow.
// You can now use `useAuth` from `@/context/auth-provider` throughout the app.

export function useOldAuth() {
  // This function is kept to avoid breaking changes if it was imported elsewhere,
  // but it should not be used. The real `useAuth` is in the provider.
  throw new Error("useAuth from 'hooks/use-auth' is deprecated. Import `useAuth` from `@/context/auth-provider` instead.");
}
