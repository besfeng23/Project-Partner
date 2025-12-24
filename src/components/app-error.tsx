"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function AppError({ title = "Something went wrong", message, onRetry }: AppErrorProps) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-4 text-center">
      <div>
        <h2 className="text-xl font-semibold font-headline">{title}</h2>
        {message && <p className="text-sm text-muted-foreground mt-2 max-w-lg">{message}</p>}
      </div>
      <Button onClick={onRetry ?? (() => window.location.reload())} variant="outline">
        <RefreshCcw className="mr-2 h-4 w-4" />
        Reload
      </Button>
    </div>
  );
}
