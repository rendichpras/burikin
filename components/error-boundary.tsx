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
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Terjadi Kesalahan</h2>
          <p className="text-sm text-muted-foreground">
            Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-colors text-sm font-medium"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
