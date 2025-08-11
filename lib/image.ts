import imageCompression from 'browser-image-compression';

import { fileToDataUrl as baseFileToDataUrl } from './utils';

export async function fileToDataUrl(file: File): Promise<string> {
  // Opsi untuk mempertahankan orientasi gambar
  const options = {
    maxSizeMB: 10,
    maxWidthOrHeight: 5000,
    useWebWorker: true,
    preserveExif: true,
    onProgress: () => {}
  };

  try {
    // Kompresi dan perbaikan orientasi
    const compressedFile = await imageCompression(file, options);
    return baseFileToDataUrl(compressedFile);
  } catch (error) {
    console.error('Error processing image:', error);
    // Fallback ke metode original jika ada error
    return baseFileToDataUrl(file);
  }
}