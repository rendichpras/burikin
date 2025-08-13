'use client';

import { useEffect } from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error ke analytics service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="bg-card/90 backdrop-blur-sm rounded-sm border-2 border-border p-6 neo-shadow">
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Terjadi Kesalahan</h2>
            <p className="text-sm text-muted-foreground font-medium">
              Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 rounded-sm bg-primary/20 text-primary border-2 border-primary hover:bg-primary/30 transition-all duration-200 text-sm font-semibold shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-0 active:translate-y-0 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
