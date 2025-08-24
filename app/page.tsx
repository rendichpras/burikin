'use client';

import { useEffect, useState } from 'react';
import { UploadArea } from "@/components/upload-area";
import { MediaComparison } from "@/components/media-comparison";
import { VideoProcessor } from "@/components/video-processor";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useVideoUpload } from "@/hooks/use-video-upload";
import { Image as ImageIcon, Video } from 'lucide-react';
import { MediaPreview } from '@/components/media-preview';
import { ExportDialog } from '@/components/export-dialog';
import { SEOHead } from '@/components/seo-head';

type MediaType = 'image' | 'video';

export default function Page() {
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [targetH, setTargetH] = useState<number>(96);

  // Image Upload Hook
  const {
    file: imageFile,
    preview: imagePreview,
    loading: imageLoading,
    progress: imageProgress,
    resultUrl: imageResultUrl,
    error: imageError,
    serverBusy: imageServerBusy,
    imageDimensions,
    send: sendImage,
    onDrop: onDropImage,
    cleanup: cleanupImage,
    setError: setImageError,
    setResultUrl: setImageResultUrl,
    setLoading: setImageLoading,
    setFile: setImageFile,
    setImageDimensions,
    setPreview: setImagePreview
  } = useImageUpload();

  // Video Upload Hook
  const {
    file: videoFile,
    preview: videoPreview,
    loading: videoLoading,
    progress: videoProgress,
    resultUrl: videoResultUrl,
    error: videoError,
    serverBusy: videoServerBusy,
    videoMeta,
    send: sendVideo,
    onDrop: onDropVideo,
    cleanup: cleanupVideo,
    setError: setVideoError,
    setResultUrl: setVideoResultUrl,
    setLoading: setVideoLoading,
    setFile: setVideoFile,
    setVideoMeta,
    setPreview: setVideoPreview
  } = useVideoUpload();

  // Image Effect
  useEffect(() => {
    if (imageFile && mediaType === 'image') {
      sendImage(targetH);
    }
  }, [imageFile, targetH, sendImage, mediaType]);

  // Video Effect
  useEffect(() => {
    if (videoFile && mediaType === 'video') {
      sendVideo({ height: 144, preserveAudio: false }); // Default to 144p with compressed audio
    }
  }, [videoFile, mediaType, sendVideo]);

  // Cleanup Effect
  useEffect(() => {
    return () => {
      cleanupImage();
      cleanupVideo();
    };
  }, [cleanupImage, cleanupVideo]);

  return (
    <>
      <SEOHead />
      <div className="flex-1 flex items-center py-8 sm:py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* SEO Heading */}
            <header className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                Kompresi Gambar & Video Online Gratis
              </h1>
              <h2 className="text-lg font-semibold text-muted-foreground">
                Kompres file gambar dan video tanpa watermark, tanpa menyimpan file Anda
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Mendukung format JPG, PNG, WebP, MP4, dan WebM. Semua proses dilakukan di browser Anda.
              </p>
            </header>

        {/* Media Type Selector */}
        <div className="bg-card/90 backdrop-blur-sm rounded-md border border-border p-5 shadow-md">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setMediaType('image');
                setTargetH(96);
                // Reset video states
                setVideoFile(null);
                setVideoPreview(null);
                setVideoResultUrl(null);
                setVideoError(null);
                setVideoMeta(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-300 border font-medium ${
                mediaType === 'image'
                  ? 'bg-primary/10 text-primary border-primary shadow-md'
                  : 'border-border hover:border-primary/40 hover:bg-muted/50 shadow-sm hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">Gambar</span>
              <span className="text-xs text-muted-foreground">50MB</span>
            </button>
            <button
              onClick={() => {
                setMediaType('video');
                setTargetH(144);
                // Reset image states
                setImageFile(null);
                setImagePreview(null);
                setImageResultUrl(null);
                setImageError(null);
                setImageDimensions(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-300 border font-medium ${
                mediaType === 'video'
                  ? 'bg-primary/10 text-primary border-primary shadow-md'
                  : 'border-border hover:border-primary/40 hover:bg-muted/50 shadow-sm hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="text-sm">Video</span>
              <span className="text-xs text-muted-foreground">500MB</span>
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3 px-2">
            Semua proses dilakukan di browser Anda. Kami tidak menyimpan file yang Anda unggah.
          </p>
        </div>

        {/* Image Processing */}
        {mediaType === 'image' && (
          <>
            {!imagePreview ? (
              <UploadArea 
                loading={imageLoading} 
                onDrop={onDropImage}
                accept={{
                  'image/jpeg': [],
                  'image/png': [],
                  'image/gif': []
                }}
                maxSize={50 * 1024 * 1024}
              />
            ) : (
              <MediaPreview
                type="image"
                file={imageFile}
                preview={imagePreview}
                loading={imageLoading}
                serverBusy={imageServerBusy}
                resultUrl={imageResultUrl}
                mediaMeta={imageDimensions}
                setLoading={setImageLoading}

                onFileChange={(f) => {
                  setImageError(null);
                  setImageResultUrl(null);
                  setImageLoading(true);
                  setImageFile(f);
                  const url = URL.createObjectURL(f);
                  const img = new window.Image();
                  img.onload = () => {
                    setImageDimensions({ width: img.width, height: img.height });
                  };
                  img.src = url;
                  setImagePreview(url);
                }}
              />
            )}

            {imagePreview && imageResultUrl && (
              <>
                <MediaComparison
                  type="image"
                  preview={imagePreview}
                  resultUrl={imageResultUrl}
                  loading={imageLoading}
                  progress={imageProgress}
                  mediaMeta={imageDimensions}
                  targetH={targetH}
                  setTargetH={setTargetH}
                  file={imageFile}
                />
                <ExportDialog
                  file={imageFile}
                  resultUrl={imageResultUrl}
                  type="image"
                />
              </>
            )}

            {imageError && (
              <div className="p-5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm shadow-sm">
                {imageError}
              </div>
            )}
          </>
        )}

        {/* Video Processing */}
        {mediaType === 'video' && (
          <>
            {!videoPreview ? (
              <UploadArea 
                loading={videoLoading} 
                onDrop={onDropVideo}
                accept={{
                  'video/mp4': [],
                  'video/webm': [],
                  'video/quicktime': []
                }}
                maxSize={500 * 1024 * 1024}
              />
            ) : (
              <MediaPreview
                type="video"
                file={videoFile}
                preview={videoPreview}
                loading={videoLoading}
                serverBusy={videoServerBusy}
                resultUrl={videoResultUrl}
                mediaMeta={videoMeta}
                setLoading={setVideoLoading}

                onFileChange={(f) => {
                  setVideoError(null);
                  setVideoResultUrl(null);
                  setVideoLoading(true);
                  setVideoFile(f);
                  const url = URL.createObjectURL(f);
                  setVideoPreview(url);
                  
                  // Get video metadata
                  const video = document.createElement('video');
                  video.onloadedmetadata = () => {
                    setVideoMeta({
                      width: video.videoWidth,
                      height: video.videoHeight,
                      duration: video.duration
                    });
                  };
                  video.src = url;
                }}
              />
            )}

            {videoPreview && videoResultUrl && (
              <VideoProcessor
                preview={videoPreview}
                resultUrl={videoResultUrl}
                loading={videoLoading}
                progress={videoProgress}
                videoMeta={videoMeta}
                file={videoFile}
                targetH={targetH}
                onSettingsChange={(settings) => {
                  setTargetH(settings.height);
                  sendVideo({ height: settings.height, preserveAudio: settings.preserveAudio });
                }}
              />
            )}

            {videoError && (
              <div className="p-5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm shadow-sm">
                {videoError}
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
    </>
  );
}