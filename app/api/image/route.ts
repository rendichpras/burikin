import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { rateLimit } from '@/lib/rate-limit';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_DIMENSION = 5000;
const MIN_DIMENSION = 1;

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { success, remaining } = await rateLimit.check(ip);
    if (!success) {
      return NextResponse.json({ 
        error: 'Terlalu banyak request. Coba lagi dalam beberapa menit.' 
      }, { status: 429 });
    }

    const body = await req.json();
    
    // Basic input validation
    if (typeof body !== 'object' || !body || typeof body.image !== 'string') {
      return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 });
    }

    const dataUrl = body.image;
    const targetHeight = Math.floor(Number(body.targetHeight)) || 144;

    // Validate data URL format first
    if (!dataUrl || dataUrl.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Format gambar tidak valid' }, { status: 400 });
    }

    const [header, base64] = dataUrl.split(',');
    if (!header || !base64 || !header.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Format gambar tidak valid' }, { status: 400 });
    }

    // Extract mime type
    const mime = header.slice(5, header.indexOf(';'));
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return NextResponse.json({ error: 'Format gambar tidak didukung' }, { status: 400 });
    }

    // Decode and validate image
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // Get image dimensions
    const meta = await sharp(buffer).metadata();
    if (!meta.width || !meta.height || 
        meta.width > MAX_DIMENSION || 
        meta.height > MAX_DIMENSION) {
      return NextResponse.json({ 
        error: `Dimensi gambar tidak valid. Maksimal ${MAX_DIMENSION}px` 
      }, { status: 400 });
    }

    // Process image with timeout
    const processPromise = (async () => {
      const scale = Math.min(targetHeight / meta.height, 1);
      const smallW = Math.max(MIN_DIMENSION, Math.round(meta.width * scale));
      const smallH = Math.max(MIN_DIMENSION, Math.round(meta.height * scale));

      const down = await sharp(buffer)
        .resize({ 
          width: smallW, 
          height: smallH, 
          fit: 'fill',
          withoutEnlargement: true
        })
        .toBuffer();

      return await sharp(down)
        .blur(0.5)
        .resize({ 
          width: meta.width, 
          height: meta.height,
          kernel: sharp.kernel.lanczos2
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    })();

    const result = await Promise.race([
      processPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
    ]) as Buffer;

    return NextResponse.json({ 
      result: result.toString('base64'),
      mime: 'image/jpeg'
    }, {
      headers: { 'X-RateLimit-Remaining': remaining.toString() }
    });

  } catch (err: unknown) {
    console.error('Error:', err);
    
    if (err instanceof Error) {
      if (err.message === 'Timeout') {
        return NextResponse.json({ error: 'Waktu pemrosesan terlalu lama' }, { status: 408 });
      }
      if (err.message.includes('Input buffer contains unsupported image format')) {
        return NextResponse.json({ error: 'Format gambar tidak didukung' }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: 'Terjadi kesalahan saat memproses gambar' 
    }, { status: 500 });
  }
}