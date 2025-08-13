'use client';

import { ReactCompareSlider } from 'react-compare-slider';
import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';
import { MediaSettings } from "@/components/media-settings";

interface MediaDimensions {
  width: number;
  height: number;
}

interface VideoMeta extends MediaDimensions {
  duration: number;
}

interface MediaComparisonProps {
  type: 'image' | 'video';
  preview: string;
  resultUrl: string;
  loading: boolean;
  progress: number;
  mediaMeta: MediaDimensions | VideoMeta | null;
  targetH: number;
  setTargetH: (height: number) => void;
  file: File | null;
  onSettingsChange?: (settings: {
    height: number;
    preserveAudio?: boolean;
  }) => void;
}

export function MediaComparison({
  type,
  preview,
  resultUrl,
  loading,
  progress,
  mediaMeta,
  targetH,
  setTargetH,
  onSettingsChange
}: MediaComparisonProps) {
  const isVideo = type === 'video';

  const renderMedia = (url: string, isOriginal: boolean) => {
    if (isVideo) {
      return (
        <div className="relative w-full h-full">
          <video
            src={url}
            controls
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className={`absolute top-4 ${isOriginal ? 'left-4' : 'right-4'} bg-background/90 backdrop-blur-sm rounded-sm border-2 border-border px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]`}>
            <div className="font-semibold">{isOriginal ? 'Video Asli' : 'Resolusi Rendah'}</div>
            {mediaMeta && (
              <div className="text-xs text-muted-foreground font-medium">
                {isOriginal 
                  ? `${mediaMeta.width} × ${mediaMeta.height}px`
                  : `${Math.round(mediaMeta.width * (targetH / mediaMeta.height))} × ${targetH}px`}
                {isVideo && 'duration' in mediaMeta && (
                  <span> • {Math.round(mediaMeta.duration)}s</span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <Image 
          src={url}
          alt={isOriginal ? 'Media Asli' : 'Resolusi Rendah'}
          fill
          className="object-contain"
          unoptimized
          priority
        />
        <div className={`absolute top-4 ${isOriginal ? 'left-4' : 'right-4'} bg-background/90 backdrop-blur-sm rounded-sm border-2 border-border px-3 py-2 text-sm shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]`}>
          <div className="font-semibold">{isOriginal ? 'Gambar Asli' : 'Resolusi Rendah'}</div>
          {mediaMeta && (
            <div className="text-xs text-muted-foreground font-medium">
              {isOriginal 
                ? `${mediaMeta.width} × ${mediaMeta.height}px`
                : `${Math.round(mediaMeta.width * (targetH / mediaMeta.height))} × ${targetH}px`}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm overflow-hidden bg-card/90 backdrop-blur-sm border-2 border-border relative neo-shadow">
        <div 
          style={{
            position: 'relative',
            paddingTop: mediaMeta 
              ? `${(mediaMeta.height / mediaMeta.width) * 100}%` 
              : '75%'
          }}
        >
          <div className="absolute inset-0">
            {loading && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
                role="status"
                aria-label={`Sedang memproses ${isVideo ? 'video' : 'gambar'}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full max-w-[200px] space-y-3">
                    <div className="h-1 w-full bg-muted rounded-sm overflow-hidden border-2 border-border">
                      <div 
                        className="h-full bg-primary transition-all duration-300 rounded-sm" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">
                        Memproses {isVideo ? 'video' : 'gambar'}...
                      </span>
                      <span className="text-primary font-semibold">{progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <ReactCompareSlider
              itemOne={renderMedia(preview, true)}
              itemTwo={renderMedia(resultUrl, false)}
              style={{
                height: '100%',
                width: '100%'
              }}
              position={50}
              className="!h-full group transition-all"
              handle={
                <div className="w-0.5 h-full bg-white/90 group-hover:bg-primary transition-all duration-300 flex items-center justify-center">
                  <div className="absolute left-1/2 -translate-x-1/2 bg-white rounded-sm border-2 border-border shadow-[0_0_0_4px_rgba(255,255,255,0.4)] p-2 transition-all duration-300 group-hover:scale-110">
                    <MoveHorizontal className="w-4 h-4 text-primary" />
                  </div>
                </div>
              }
              onPositionChange={(position) => {
                const handle = document.querySelector('.react-compare-slider-handle');
                if (handle) {
                  handle.setAttribute('aria-label', `Penggeser di posisi ${Math.round(position)}%`);
                }
              }}
            />
          </div>
        </div>
      </div>

      {!isVideo && (
        <MediaSettings
          type="image"
          targetH={targetH}
          onApplySettings={settings => {
            setTargetH(settings.height);
            onSettingsChange?.(settings);
          }}
        />
      )}
    </div>
  );
}
