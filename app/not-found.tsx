'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Halaman Tidak Ditemukan</h2>
          <p className="text-sm text-muted-foreground">
            Maaf, halaman yang Anda cari tidak ditemukan.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-colors text-sm font-medium"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
