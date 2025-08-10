import imageCompression from 'browser-image-compression';

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
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('Error processing image:', error);
    // Fallback ke metode original jika ada error
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: 'image/jpeg' });
}