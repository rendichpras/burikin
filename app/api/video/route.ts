import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import { rateLimit } from '@/lib/rate-limit';
import { join } from 'path';
import { writeFile, unlink, readFile } from 'fs/promises';
import { tmpdir } from 'os';

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Set ffmpeg path
ffmpeg.setFfmpegPath('ffmpeg');

export async function POST(req: Request) {
  // Generate unique temp filenames
  const timestamp = Date.now();
  const inputPath = join(tmpdir(), `input-${timestamp}.mp4`);
  const outputPath = join(tmpdir(), `output-${timestamp}.mp4`);

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
    if (typeof body !== 'object' || !body || typeof body.video !== 'string') {
      return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 });
    }

    const dataUrl = body.video;
    const targetHeight = Math.floor(Number(body.targetHeight)) || 144; // Default to 144p
    const preserveAudio = Boolean(body.preserveAudio);

    // Generate cache key
    const cacheKey = createHash('md5')
      .update(`${dataUrl}${targetHeight}${preserveAudio}`)
      .digest('hex');
    
    const cacheDir = join(tmpdir(), 'video-cache');
    const cachePath = join(cacheDir, `${cacheKey}.mp4`);

    try {
      // Try to read from cache
      const cachedVideo = await readFile(cachePath);
      return NextResponse.json({
        result: `data:video/mp4;base64,${cachedVideo.toString('base64')}`,
        mime: 'video/mp4',
        cached: true
      });
    } catch {
      // Cache miss, continue with processing
    }

    // Validate data URL format
    if (!dataUrl || dataUrl.length > MAX_VIDEO_SIZE) {
      return NextResponse.json({ error: 'Ukuran file melebihi batas maksimum (50MB). Silakan pilih file yang lebih kecil.' }, { status: 400 });
    }

    const [header, base64] = dataUrl.split(',');
    if (!header || !base64 || !header.startsWith('data:video/')) {
      return NextResponse.json({ error: 'Format video tidak valid' }, { status: 400 });
    }

    // Extract mime type
    const mime = header.slice(5, header.indexOf(';'));
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return NextResponse.json({ 
        error: `Format tidak didukung. Format yang didukung: MP4, WebM, MOV` 
      }, { status: 400 });
    }

    // Write input file
    const buffer = Buffer.from(base64, 'base64');
    await writeFile(inputPath, buffer);

    // Process video
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size(`?x${targetHeight}`)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate(preserveAudio ? '128k' : '32k') // Kompresi audio jika tidak preserve
        .outputOptions([
          '-preset ultrafast', // Lebih cepat tapi ukuran lebih besar
          '-crf 28', // Kualitas lebih rendah untuk ukuran lebih kecil
          '-movflags faststart',
          '-strict experimental',
          ...(preserveAudio ? [] : ['-ac 1']) // Mono audio jika tidak preserve
        ])
        .on('error', reject)
        .on('end', resolve)
        .save(outputPath);
    });

    // Read output file
    const outputBuffer = await readFile(outputPath);
    const outputBase64 = outputBuffer.toString('base64');

    // Save to cache
    try {
      await writeFile(cachePath, outputBuffer);
    } catch {
      // Ignore cache write errors
    }

    // Cleanup temp files
    await Promise.all([
      unlink(inputPath),
      unlink(outputPath)
    ]);

    return NextResponse.json({ 
      result: `data:video/mp4;base64,${outputBase64}`,
      mime: 'video/mp4'
    }, {
      headers: { 'X-RateLimit-Remaining': remaining.toString() }
    });

  } catch (err: unknown) {
    console.error('Error:', err);
    
    // Cleanup temp files on error
    try {
      await Promise.all([
        unlink(inputPath),
        unlink(outputPath)
      ]);
    } catch {
      // Ignore cleanup errors
    }

    if (err instanceof Error) {
      if (err.message.includes('duration')) {
        return NextResponse.json({ 
          error: 'Tidak dapat membaca durasi video' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: 'Terjadi kesalahan saat memproses video' 
    }, { status: 500 });
  }
}