'use client';

import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, Loader2 } from 'lucide-react';

interface UploadAreaProps {
  loading: boolean;
  onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function UploadArea({ 
  loading, 
  onDrop,
  accept = {
    'image/jpeg': [],
    'image/png': [],
    'image/gif': []
  },
  maxSize = 10 * 1024 * 1024 // 10MB default
}: UploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
    maxSize
  });

  const acceptTypes = Object.keys(accept).map(type => {
    switch(type) {
      case 'image/jpeg': return 'JPG';
      case 'image/png': return 'PNG';
      case 'image/gif': return 'GIF';
      case 'video/mp4': return 'MP4';
      case 'video/webm': return 'WebM';
      case 'video/quicktime': return 'MOV';
      default: return type.split('/')[1].toUpperCase();
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border border-dashed rounded-xl p-8 text-center transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20 hover:bg-muted/50'}
        cursor-pointer bg-card/50 backdrop-blur-sm
      `}
    >
      <input {...getInputProps()} disabled={loading} />
      <div className="space-y-6">
        <div className="w-20 h-20 mx-auto rounded-xl bg-primary/5 flex items-center justify-center relative">
          {loading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">
            {loading ? 'Memproses...' : isDragActive ? 'Lepaskan file' : 'Unggah File'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isDragActive ? 'Lepaskan untuk mengunggah' : 'Seret & lepas atau klik untuk memilih'}
          </p>
          <p className="text-[10px] text-muted-foreground/80">
            Format: {acceptTypes.join(', ')} • Maks {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>
    </div>
  );
}