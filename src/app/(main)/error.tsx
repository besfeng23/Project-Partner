"use client";

import { useEffect } from "react";
import { AppError } from "@/components/app-error";

export default function MainError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Route error in (main):', error);
  }, [error]);

  return (
    <AppError
      title="Something went wrong"
      message={error.message}
      onRetry={reset}
    />
  );
}
