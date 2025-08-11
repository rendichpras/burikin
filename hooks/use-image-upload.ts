'use client';

import { useState, useCallback } from 'react';
import { FileRejection } from 'react-dropzone';
import { fileToDataUrl } from "@/lib/image";
import { dataURLtoBlob } from "@/lib/utils";
import imageCompression from 'browser-image-compression';

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverBusy, setServerBusy] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const send = useCallback(async (targetH: number) => {
    if (!file) {
      setError('Pilih gambar dulu');
      return;
    }
    
    setError(null);
    setLoading(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const dataUrl = await fileToDataUrl(file);
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: dataUrl, 
          targetHeight: targetH
        }),
      });
      
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 503) {
          setServerBusy(true);
          return;
        }
        throw new Error(json?.error || 'Server error');
      }
      setServerBusy(false);
      
      const b64 = json.result;
      const blob = dataURLtoBlob(`data:image/jpeg;base64,${b64}`);
      const url = URL.createObjectURL(blob);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResultUrl(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [file]);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-too-large') {
        setError(`Ukuran file terlalu besar (${(fileRejections[0].file.size / 1024 / 1024).toFixed(1)}MB). Maksimum 50MB.`);
      } else {
        setError('Format file tidak didukung. Gunakan JPG, PNG, atau GIF.');
      }
      return;
    }

    const f = acceptedFiles[0];
    if (!f) return;
    
    setError(null);
    setResultUrl(null);
    setFile(f);
    
    // Gunakan library untuk memproses preview
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: 5000,
      useWebWorker: true,
      preserveExif: true,
      onProgress: () => {}
    };

    try {
      const compressedFile = await imageCompression(f, options);
      const url = URL.createObjectURL(compressedFile);
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
      setPreview(url);
    } catch (error) {
      // Fallback ke metode original
      const url = URL.createObjectURL(f);
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
      setPreview(url);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [preview, resultUrl]);

  return {
    file,
    preview,
    loading,
    progress,
    resultUrl,
    error,
    serverBusy,
    imageDimensions,
    send,
    onDrop,
    cleanup,
    setError,
    setResultUrl,
    setLoading,
    setFile,
    setImageDimensions,
    setPreview,
    setServerBusy
  };
}