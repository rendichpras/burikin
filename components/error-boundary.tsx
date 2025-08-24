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
        <div className="bg-card/90 backdrop-blur-sm rounded-md border border-border p-6 shadow-md">
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Terjadi Kesalahan</h2>
            <p className="text-sm text-muted-foreground">
              Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-sm"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
