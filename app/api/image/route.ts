import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { rateLimit } from '@/lib/rate-limit';
import { createHash } from 'crypto';
import { join } from 'path';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { tmpdir } from 'os';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_DIMENSION = 5000;
const MIN_DIMENSION = 1;

export async function POST(req: Request) {
  let processId = 0; // Default value
  
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { success, remaining, serverBusy } = await rateLimit.check(ip);
    if (!success) {
      if (serverBusy) {
        return NextResponse.json({ 
          error: 'Server sedang sibuk. Mohon tunggu beberapa saat.' 
        }, { status: 503 });
      }
      return NextResponse.json({ 
        error: 'Terlalu banyak permintaan. Coba lagi nanti.' 
      }, { status: 429 });
    }
    
    // Mulai tracking proses
    processId = rateLimit.startProcess();

    const body = await req.json();
    
    // Basic input validation
    if (typeof body !== 'object' || !body || typeof body.image !== 'string') {
      return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 });
    }

    const dataUrl = body.image;
    const targetHeight = Math.floor(Number(body.targetHeight)) || 144;

    // Generate cache key
    const cacheKey = createHash('md5')
      .update(`${dataUrl}${targetHeight}`)
      .digest('hex');
    
    const cacheDir = join(tmpdir(), 'image-cache');
    const cachePath = join(cacheDir, `${cacheKey}.jpg`);

    // Ensure cache directory exists
    try {
      await mkdir(cacheDir, { recursive: true });
    } catch {
      // Ignore mkdir errors
    }

    try {
      // Try to read from cache
      const cachedImage = await readFile(cachePath);
      return NextResponse.json({
        result: `data:image/jpeg;base64,${cachedImage.toString('base64')}`,
        mime: 'image/jpeg',
        cached: true
      });
    } catch {
      // Cache miss, continue with processing
    }

    // Validate data URL presence
    if (!dataUrl) {
      return NextResponse.json({ error: 'Input tidak valid.' }, { status: 400 });
    }

    const [header, base64] = dataUrl.split(',');
    if (!header || !base64 || !header.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Input tidak valid.' }, { status: 400 });
    }

    // Extract mime type
    const mime = header.slice(5, header.indexOf(';'));
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return NextResponse.json({ error: 'Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF.' }, { status: 400 });
    }

    // Decode and validate image
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File terlalu besar. Maks ${MAX_FILE_SIZE / 1024 / 1024}MB.` 
      }, { status: 400 });
    }

    // Get image dimensions
    const meta = await sharp(buffer).metadata();
    if (!meta.width || !meta.height || 
        meta.width > MAX_DIMENSION || 
        meta.height > MAX_DIMENSION) {
      return NextResponse.json({ 
        error: `Dimensi gambar tidak valid. Maks ${MAX_DIMENSION}px.` 
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
        .resize({ 
          width: meta.width, 
          height: meta.height,
          kernel: sharp.kernel.lanczos2
        })
        .jpeg({ quality: 100 })
        .toBuffer();
    })();

    const result = await Promise.race([
      processPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
    ]) as Buffer;

    // Save to cache
    try {
      await writeFile(cachePath, result);
    } catch {
      // Ignore cache write errors
    }

    // Akhiri tracking proses setelah sukses
    rateLimit.endProcess(processId);

    return NextResponse.json({ 
      result: result.toString('base64'),
      mime: 'image/jpeg'
    }, {
      headers: { 'X-RateLimit-Remaining': remaining.toString() }
    });

  } catch (err: unknown) {
    console.error('Error:', err);
    
    // Akhiri tracking proses
    rateLimit.endProcess(processId);
    
    if (err instanceof Error) {
      if (err.message === 'Timeout') {
        return NextResponse.json({ 
          error: 'Timeout. Coba lagi.' 
        }, { status: 408 });
      }
      if (err.message.includes('Input buffer contains unsupported image format')) {
        return NextResponse.json({ error: 'Format tidak didukung. Gunakan JPG, PNG, atau GIF.' }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: 'Terjadi kesalahan di server. Coba lagi.' 
    }, { status: 500 });
  }
}