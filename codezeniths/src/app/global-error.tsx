'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorBoundary({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical root layout error
    console.error('Next.js Global Root Error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen m-0 p-0 flex flex-col items-center justify-center bg-[#1a1b26] text-[#a9b1d6] font-sans antialiased selection:bg-[#7aa2f7]/30 selection:text-[#f7768e]">
        <div className="relative w-full max-w-lg mx-auto p-6 sm:p-8 rounded-2xl bg-[#1d223d]/90 border border-[#272e50] shadow-2xl backdrop-blur-md text-center flex flex-col items-center space-y-6">
          {/* Subtle Tokyo Night ambient radial glow */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-72 h-72 bg-[#f7768e]/15 blur-[100px] rounded-full" />
          </div>

          {/* Critical Error Icon with Rose Accent */}
          <div
            data-testid="global-error-icon"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f7768e]/10 border border-[#f7768e]/30 flex items-center justify-center text-[#f7768e] shadow-lg shadow-[#f7768e]/10"
          >
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-[#f7768e] stroke-[2]" />
          </div>

          {/* Heading and Description */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#f7f6ff]">
              Critical Application Error
            </h1>
            <p className="text-sm sm:text-base text-[#828bb8] max-w-sm mx-auto leading-relaxed">
              {error?.message && error.message.trim().length > 0
                ? error.message
                : 'A critical root-level error occurred. The application was unable to render the layout.'}
            </p>
          </div>

          {/* Digest Indicator (Rose/Teal Accent) */}
          {error?.digest && (
            <div className="px-3 py-1.5 rounded-lg bg-[#222847] border border-[#272e50] text-xs font-mono text-[#73daca] select-all">
              Digest: <span className="font-semibold">{error.digest}</span>
            </div>
          )}

          {/* Recovery Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-[#6a7cff] hover:bg-[#8a98ff] active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#6a7cff]/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-[#a9b1d6] bg-[#222847] hover:bg-[#272e50] border border-[#272e50] hover:text-[#f7f6ff] active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
