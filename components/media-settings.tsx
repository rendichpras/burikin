'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface MediaSettingsProps {
  type: 'image' | 'video';
  targetH: number;
  onApplySettings: (settings: { height: number; audioBitrate: number }) => void;
}

export function MediaSettings({ 
  type,
  targetH, 
  onApplySettings
}: MediaSettingsProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customHeight, setCustomHeight] = useState(String(targetH));
  const [tempHeight, setTempHeight] = useState(type === 'video' ? 144 : targetH);
  const [isCustomAudio, setIsCustomAudio] = useState(false);
  const [audioBitrate, setAudioBitrate] = useState(32);
  const [customAudioBitrate, setCustomAudioBitrate] = useState("32");


  const handleCustomHeightChange = (value: string) => {
    setCustomHeight(value);
    const num = Number(value);
    if (!isNaN(num) && num > 0 && num <= 1080) {
      setTempHeight(num);
    }
  };

  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-sm border-2 border-border p-4 neo-shadow">
      <div className="space-y-4">
          {/* Image Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Pilih Resolusi</Label>
            {!isCustom ? (
              <Select 
                value={String(tempHeight)} 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setIsCustom(true);
                    setCustomHeight(String(tempHeight));
                  } else {
                    setTempHeight(Number(value));
                  }
                }}
              >
                <SelectTrigger className="w-full border-2 border-border rounded-sm shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <SelectValue placeholder="Pilih resolusi" />
                </SelectTrigger>
                <SelectContent>
                  {type === 'video' ? (
                    <>
                      <SelectItem value="720">Kualitas Tinggi (720p)</SelectItem>
                      <SelectItem value="480">Kualitas Standar (480p)</SelectItem>
                      <SelectItem value="360">360p</SelectItem>
                      <SelectItem value="240">240p</SelectItem>
                      <SelectItem value="144">144p</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="144">Kualitas Tinggi (144px)</SelectItem>
                      <SelectItem value="96">Kualitas Menengah (96px)</SelectItem>
                      <SelectItem value="48">Kualitas Rendah (48px)</SelectItem>
                      <SelectItem value="24">Kualitas Sangat Rendah (24px)</SelectItem>
                    </>
                  )}
                  <SelectItem value="custom">Kustom...</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="1080"
                    value={customHeight}
                    onChange={(e) => handleCustomHeightChange(e.target.value)}
                    className="flex-1 border-2 border-border rounded-sm shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    placeholder="Tinggi kustom (px)"
                  />
                  <button
                    onClick={() => {
                      setIsCustom(false);
                      setTempHeight(96); // Reset to default
                    }}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-border bg-background hover:bg-accent hover:border-accent h-9 px-3 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    type="button"
                  >
                    Batal
                  </button>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Masukkan nilai antara 1-1080px
                </p>
              </div>
            )}
          </div>

          {/* Audio Settings for Video */}
          {type === 'video' && (
            <div className="space-y-3 pt-3 border-t-2 border-border">
              <Label className="text-sm font-semibold">Suara</Label>
              {!isCustomAudio ? (
                <Select 
                  value={String(audioBitrate)} 
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setIsCustomAudio(true);
                      setCustomAudioBitrate(String(audioBitrate));
                    } else {
                      setAudioBitrate(Number(value));
                    }
                  }}
                >
                  <SelectTrigger className="w-full border-2 border-border rounded-sm shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    <SelectValue placeholder="Pilih kualitas suara" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32">32kbps</SelectItem>
                    <SelectItem value="16">16kbps</SelectItem>
                    <SelectItem value="8">8kbps</SelectItem>
                    <SelectItem value="4">4kbps</SelectItem>
                    <SelectItem value="custom">Kustom</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="320"
                      value={customAudioBitrate}
                      onChange={(e) => {
                        setCustomAudioBitrate(e.target.value);
                        const num = Number(e.target.value);
                        if (!isNaN(num) && num > 0 && num <= 320) {
                          setAudioBitrate(num);
                        }
                      }}
                      className="flex-1 border-2 border-border rounded-sm shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      placeholder="1-320"
                    />
                    <button
                      onClick={() => {
                        setIsCustomAudio(false);
                        setAudioBitrate(32); // Reset ke default
                      }}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-border bg-background hover:bg-accent hover:border-accent h-9 px-3 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                      type="button"
                    >
                      Batal
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">1-320</p>
                </div>
              )}

            </div>
          )}

        {/* Apply Button */}
        <button
          onClick={() => onApplySettings({ height: tempHeight, audioBitrate })}
          className="w-full h-12 inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold bg-primary/20 text-primary border-2 border-primary hover:bg-primary/30 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-0 active:translate-y-0 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          type="button"
        >
          Terapkan Perubahan
        </button>
      </div>
    </div>
  );
}
