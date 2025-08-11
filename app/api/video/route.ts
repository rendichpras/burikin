import { NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import { rateLimit } from '@/lib/rate-limit';
import { join } from 'path';
import { writeFile, unlink, readFile } from 'fs/promises';
import { tmpdir } from 'os';

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

// Set ffmpeg path
ffmpeg.setFfmpegPath('ffmpeg');

export async function POST(req: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Generate unique temp filenames
  const timestamp = Date.now();
  const inputPath = join(tmpdir(), `input-${timestamp}.mp4`);
  const outputPath = join(tmpdir(), `output-${timestamp}.mp4`);

  let processId = 0; // Default value

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  console.log(`[${requestId}][VIDEO] Processing request started | IP: ${ip}`);
  
  try {
    // Rate limiting

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
    if (typeof body !== 'object' || !body || typeof body.video !== 'string') {
      return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 });
    }

    const dataUrl = body.video;
    const targetHeight = Math.floor(Number(body.targetHeight)) || 144; // Default to 144p
    const preserveAudio = Boolean(body.preserveAudio);

    // Validate data URL presence
    if (!dataUrl) {
      return NextResponse.json({ error: 'Input tidak valid.' }, { status: 400 });
    }

    const [header, base64] = dataUrl.split(',');
    if (!header || !base64 || !header.startsWith('data:video/')) {
      return NextResponse.json({ error: 'Input tidak valid.' }, { status: 400 });
    }

    // Extract mime type
    const mime = header.slice(5, header.indexOf(';'));
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return NextResponse.json({ 
        error: 'Format tidak didukung. Gunakan MP4, WebM, atau MOV.' 
      }, { status: 400 });
    }

    // Write input file
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > MAX_VIDEO_SIZE) {
      return NextResponse.json({ error: `File terlalu besar. Maks ${MAX_VIDEO_SIZE / 1024 / 1024}MB.` }, { status: 400 });
    }
    await writeFile(inputPath, buffer);

    // Process video with timeout
    const processingPromise = new Promise((resolve, reject) => {
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

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 600000)); // 10 menit
    await Promise.race([processingPromise, timeoutPromise]);

    // Read output file
    const outputBuffer = await readFile(outputPath);
    const outputBase64 = outputBuffer.toString('base64');

    // Cleanup temp files
    await Promise.all([
      unlink(inputPath),
      unlink(outputPath)
    ]);

    // Akhiri tracking proses setelah sukses
    rateLimit.endProcess(processId);

    const duration = Date.now() - startTime;
    const originalSize = buffer.length / 1024 / 1024;
    const processedSize = outputBuffer.length / 1024 / 1024;
    const compression = ((1 - processedSize / originalSize) * 100).toFixed(1);

    console.log(
      `[${requestId}][VIDEO] Processed successfully in ${duration}ms | ` +
      `Original: ${originalSize.toFixed(1)}MB | ` +
      `Processed: ${processedSize.toFixed(1)}MB | ` +
      `Compressed: ${compression}% | ` +
      `Audio: ${preserveAudio ? 'High (128k)' : 'Low (32k)'}`
    );

    return NextResponse.json({ 
      result: `data:video/mp4;base64,${outputBase64}`,
      mime: 'video/mp4'
    }, {
      headers: { 'X-RateLimit-Remaining': remaining.toString() }
    });

  } catch (err: unknown) {
    const duration = Date.now() - startTime;
    console.error(`[${requestId}][VIDEO] Error processing (${duration}ms):`, err);
    
    // Akhiri tracking proses
    rateLimit.endProcess(processId);
    
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
      if (err.message === 'Timeout') {
        return NextResponse.json({ 
          error: 'Timeout. Coba lagi.' 
        }, { status: 408 });
      }
      if (err.message.includes('duration')) {
        return NextResponse.json({ 
          error: 'Durasi video tidak dapat dibaca.' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: 'Terjadi kesalahan di server. Coba lagi.' 
    }, { status: 500 });
  }
}