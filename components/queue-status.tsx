'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface QueueStatusProps {
  onReady?: () => void;
}

interface QueueStatus {
  activeProcesses: number;
  estimatedWaitTime: number;
  position?: number;
}

export function QueueStatus({ onReady }: QueueStatusProps) {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        setStatus(data);
        
        // Jika server tidak sibuk, trigger onReady
        if (data.activeProcesses < 10) {
          onReady?.();
        }
      } catch (err) {
        setError('Gagal mendapatkan status server');
      }
    };

    // Poll setiap 5 detik
    const interval = setInterval(checkStatus, 5000);
    checkStatus(); // Check pertama kali

    return () => clearInterval(interval);
  }, [onReady]);

  if (error) return null;
  if (!status) return null;

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">
            Server sedang sibuk
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {status.activeProcesses} proses aktif • Estimasi waktu tunggu: {Math.ceil(status.estimatedWaitTime / 60)} menit
          </div>
        </div>
      </div>
    </div>
  );
}
