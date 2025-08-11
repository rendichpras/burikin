'use client';

import { useState, useCallback } from 'react';
import { FileRejection } from 'react-dropzone';

interface VideoMeta {
  width: number;
  height: number;
  duration: number;
}

export function useVideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverBusy, setServerBusy] = useState(false);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);

  const getVideoMeta = useCallback((url: string): Promise<VideoMeta> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration
        });
      };
      video.onerror = reject;
      video.src = url;
    });
  }, []);

  const fileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const send = useCallback(async (settings: { height: number; preserveAudio?: boolean }) => {
    const { height: targetHeight, preserveAudio = false } = settings;
    if (!file) {
      setError('Pilih video dulu');
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
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video: dataUrl,
          targetHeight,
          preserveAudio
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

      clearInterval(progressInterval);
      setProgress(100);
      setResultUrl(json.result);

      // Get metadata dari hasil
      const meta = await getVideoMeta(json.result);
      setVideoMeta(meta);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [file, fileToDataUrl, getVideoMeta]);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-too-large') {
        setError(`Ukuran file terlalu besar (${(fileRejections[0].file.size / 1024 / 1024).toFixed(1)}MB). Maksimum 500MB.`);
      } else {
        setError('Format file tidak didukung. Gunakan MP4, WebM, atau MOV.');
      }
      return;
    }

    const f = acceptedFiles[0];
    if (!f) return;

    setError(null);
    setResultUrl(null);
    setFile(f);

    const url = URL.createObjectURL(f);
    try {
      const meta = await getVideoMeta(url);
      setVideoMeta(meta);
      setPreview(url);
    } catch (err) {
      setError('Format video tidak didukung');
      URL.revokeObjectURL(url);
    }
  }, [getVideoMeta]);

  const cleanup = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl && resultUrl.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
  }, [preview, resultUrl]);

  return {
    file,
    preview,
    loading,
    progress,
    resultUrl,
    error,
    serverBusy,
    videoMeta,
    send,
    onDrop,
    cleanup,
    setError,
    setResultUrl,
    setLoading,
    setFile,
    setVideoMeta,
    setPreview,
    setServerBusy
  };
}
