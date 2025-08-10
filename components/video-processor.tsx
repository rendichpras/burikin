'use client';

import { useEffect, useState } from 'react';
import { ExportDialog } from "@/components/export-dialog";
import { MediaSettings } from "@/components/media-settings";

interface VideoMeta {
  width: number;
  height: number;
  duration: number;
}

interface VideoProcessorProps {
  file: File | null;
  preview: string;
  loading: boolean;
  progress: number;
  resultUrl: string | null;
  videoMeta: VideoMeta | null;
  targetH: number;
  onSettingsChange: (settings: { height: number; preserveAudio?: boolean }) => void;
}

export function VideoProcessor({
  file,
  preview,
  loading,
  progress,
  resultUrl,
  videoMeta,
  targetH,
  onSettingsChange
}: VideoProcessorProps) {
  const [currentVideo, setCurrentVideo] = useState<string>(preview);
  
  useEffect(() => {
    setCurrentVideo(resultUrl || preview);
  }, [resultUrl, preview]);

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative rounded-xl overflow-hidden bg-black/5 backdrop-blur-sm border">
        <div className="aspect-video relative">
          <video
            src={currentVideo}
            controls
            className="w-full h-full"
            poster={preview}
            onLoadedData={(e) => {
              const video = e.currentTarget;
              // Generate thumbnails
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (ctx) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnail = canvas.toDataURL('image/jpeg', 0.5);
                video.poster = thumbnail;
              }
            }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-full max-w-[200px] space-y-2">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 rounded-full" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Memproses video...</span>
                    <span className="text-primary font-medium">{progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        {videoMeta && (
          <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs space-y-0.5">
            <div className="font-medium">Info Video</div>
            <div className="text-muted-foreground space-y-0.5">
              <div>Resolusi: {videoMeta.width} × {videoMeta.height}px</div>
              <div>Durasi: {Math.round(videoMeta.duration)}s</div>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <MediaSettings
        type="video"
        targetH={targetH}
        onApplySettings={onSettingsChange}
      />

      {/* Export */}
      {resultUrl && (
        <div className="flex flex-col items-center gap-2">
          <ExportDialog
            file={file}
            resultUrl={resultUrl}
            type="video"
          />
        </div>
      )}
    </div>
  );
}