"use client";

import type { ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { ProjectPartnerIcon } from './icons';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

export function FirebaseConfigChecker({ children }: { children: ReactNode }) {
  const [missingVars, setMissingVars] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const missing = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    setMissingVars(missing);
  }, []);

  if (isClient && missingVars.length > 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-lg font-semibold font-headline">
          <ProjectPartnerIcon className="h-6 w-6" />
          Project Partner
        </div>
        <Card className="w-full max-w-2xl border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle />
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="font-semibold text-foreground">
                Firebase client configuration is incomplete.
              </p>
              <p className="text-muted-foreground mt-1">
                The application cannot connect to Firebase because one or more
                required environment variables are missing.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Missing Environment Variables:
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingVars.map((varName) => (
                  <Badge key={varName} variant="destructive">
                    {varName}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
               <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4" />
                How to Fix
              </h3>
              <p className="text-sm text-muted-foreground">
                If running on Vercel, add the missing variables in{' '}
                <strong className="text-foreground/90">
                  Project Settings &rarr; Environment Variables
                </strong>
                , ensuring they are available for all environments (Production, Preview, and Development), then redeploy.
              </p>
              <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                If running in Firebase Studio Preview, add these variables in <strong className="text-foreground/90">Project Settings → Environment Variables</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render children immediately to avoid content flash and layout shifts.
  // The check above will overlay the error if needed after the client-side check.
  return <>{children}</>;
}
