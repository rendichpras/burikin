'use client';

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RefreshCw, Loader2 } from 'lucide-react';
import { QueueStatus } from './queue-status';

interface MediaDimensions {
  width: number;
  height: number;
}

interface VideoMeta extends MediaDimensions {
  duration: number;
}

interface MediaPreviewProps {
  file: File | null;
  preview: string | null;
  loading: boolean;
  serverBusy?: boolean;
  resultUrl: string | null;
  type: 'image' | 'video';
  mediaMeta: MediaDimensions | VideoMeta | null;

  onFileChange: (file: File) => void;
  setLoading: (loading: boolean) => void;
  setServerBusy?: (busy: boolean) => void;
}

export function MediaPreview({ 
  file, 
  preview, 
  loading,
  serverBusy,
  resultUrl,
  type,
  mediaMeta,
  onFileChange,
  setLoading,
  setServerBusy
}: MediaPreviewProps) {
  const isVideo = type === 'video';
  const acceptType = isVideo ? "video/*" : "image/*";
  const buttonText = isVideo ? "Ganti Video" : "Ganti Gambar";
  const dialogTitle = isVideo ? "Ganti video?" : "Ganti gambar?";
  const dialogDescription = isVideo 
    ? "Video yang sedang diproses akan dibatalkan. Anda yakin ingin mengganti video?"
    : "Hasil konversi sebelumnya akan hilang. Apakah Anda yakin ingin mengganti gambar?";

  if (serverBusy) {
    return (
      <QueueStatus onReady={() => {
        setServerBusy?.(false);
        setLoading(false);
      }} />
    );
  }

  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-md border border-border p-5 shadow-md">
      {/* Preview Container */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Media Preview */}
          <div className="w-20 h-20 rounded-md bg-black/5 backdrop-blur-lg border border-border flex-shrink-0 relative overflow-hidden shadow-sm">
            {isVideo ? (
              <video
                src={preview || undefined}
                className="w-full h-full object-cover"
              />
            ) : (
              preview && (
                <Image 
                  src={preview} 
                  alt="preview" 
                  fill
                  className="object-cover" 
                  unoptimized 
                  priority
                />
              )
            )}
            {loading && !resultUrl && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
                role="status"
                aria-label="Sedang memproses media"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-base truncate max-w-full">{file?.name}</div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground mt-1">
              <span>{file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB</span>
              {mediaMeta && (
                <span className="flex items-center gap-1">
                  <span>•</span>
                  <span>
                    {mediaMeta.width} × {mediaMeta.height}px
                    {isVideo && 'duration' in mediaMeta && (
                      <>
                        <span> • </span>
                        <span>{Math.round(mediaMeta.duration)}s</span>
                      </>
                    )}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Change Button */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <input
            type="file"
            className="hidden"
            accept={acceptType}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                onFileChange(f);
              }
            }}
            id="media-input"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                disabled={loading && !resultUrl}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">{buttonText}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => document.getElementById('media-input')?.click()}>
                  Lanjutkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
