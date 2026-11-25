'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log segment error for observability
    console.error('Next.js Segment Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-background-light-shade1/80 dark:bg-background-dark-shade1/80 border border-background-light-shade3 dark:border-background-dark-shade2 shadow-2xl backdrop-blur-md text-center flex flex-col items-center space-y-6">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden flex items-center justify-center" aria-hidden="true">
          <div className="w-64 h-64 bg-pink/15 dark:bg-pink/20 blur-[90px] rounded-full" />
        </div>

        {/* Error Illustration / Icon */}
        <div
          data-testid="error-illustration"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink/10 border border-pink/30 flex items-center justify-center text-pink shadow-lg shadow-pink/10"
        >
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-pink stroke-[2]" />
        </div>

        {/* Heading & Description */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground-light dark:text-heading-dark">
            Something went wrong!
          </h1>
          <p className="text-sm sm:text-base text-muted-light dark:text-muted-dark max-w-sm mx-auto leading-relaxed">
            {error?.message && error.message.trim().length > 0
              ? error.message
              : 'An unexpected error occurred while processing your request.'}
          </p>
        </div>

        {/* Digest Indicator */}
        {error?.digest && (
          <div className="px-3 py-1.5 rounded-lg bg-background-light-shade2/70 dark:bg-background-dark-shade2/70 border border-secondary/20 text-xs font-mono text-secondary-shade1 dark:text-teal select-all">
            Digest: <span className="font-semibold">{error.digest}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-primary hover:bg-primary-shade1 active:scale-[0.98] transition-all duration-150 shadow-md shadow-primary/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-body-light dark:text-body-dark bg-background-light-shade2 dark:bg-background-dark-shade2 hover:bg-background-light-shade3 dark:hover:bg-background-dark-shade3 border border-secondary/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
