"use client";

import type { ReactNode } from 'react';

// Since the config is now hardcoded, this component is no longer needed
// to check for environment variables. It can simply render its children.
// We keep the file to avoid breaking imports, but its logic is removed.

export function FirebaseConfigChecker({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
