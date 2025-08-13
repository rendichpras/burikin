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
        border-2 border-dashed rounded-sm p-8 text-center transition-all duration-200 cursor-pointer
        ${isDragActive 
          ? 'border-primary bg-primary/10 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] -translate-x-1 -translate-y-1 dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]' 
          : 'border-border hover:border-primary/60 hover:bg-muted/30 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]'
        }
        bg-card/80 backdrop-blur-sm
      `}
    >
      <input {...getInputProps()} disabled={loading} />
      <div className="space-y-6">
        <div className="w-20 h-20 mx-auto rounded-sm bg-primary/10 flex items-center justify-center relative border-2 border-primary/20 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          {loading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">
            {loading ? 'Memproses...' : isDragActive ? 'Lepaskan file' : 'Unggah File'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isDragActive ? 'Lepaskan untuk mengunggah' : 'Seret & lepas atau klik untuk memilih'}
          </p>
          <p className="text-[10px] text-muted-foreground/80 font-medium">
            Format: {acceptTypes.join(', ')} • Maks {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>
    </div>
  );
}