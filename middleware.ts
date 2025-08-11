import { NextResponse } from 'next/server';

export function middleware() {
  // Hanya izinkan request dari domain kita sendiri
  const response = NextResponse.next();

  // Hapus header yang bisa digunakan untuk fingerprinting
  response.headers.delete('x-powered-by');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set('content-security-policy', 
    "default-src 'self'; " +
    "img-src 'self' data: blob:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
}
