'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface MediaSettingsProps {
  type: 'image' | 'video';
  targetH: number;
  onApplySettings: (settings: { height: number; preserveAudio?: boolean }) => void;
}

export function MediaSettings({ 
  type,
  targetH, 
  onApplySettings
}: MediaSettingsProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customHeight, setCustomHeight] = useState(String(targetH));
  const [tempHeight, setTempHeight] = useState(type === 'video' ? 144 : targetH);
  const [preserveAudio, setPreserveAudio] = useState(false);


  const handleCustomHeightChange = (value: string) => {
    setCustomHeight(value);
    const num = Number(value);
    if (!isNaN(num) && num > 0 && num <= 1080) {
      setTempHeight(num);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border p-4">
      <div className="space-y-4">
          {/* Image Settings */}
          <div className="space-y-3">
            <Label className="text-sm">Pilih Resolusi</Label>
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih resolusi" />
                </SelectTrigger>
                <SelectContent>
                  {type === 'video' ? (
                    <>
                      <SelectItem value="720">HD (720p)</SelectItem>
                      <SelectItem value="480">SD (480p)</SelectItem>
                      <SelectItem value="360">360p</SelectItem>
                      <SelectItem value="240">240p</SelectItem>
                      <SelectItem value="144">144p</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="144">HD (144px)</SelectItem>
                      <SelectItem value="96">Medium (96px)</SelectItem>
                      <SelectItem value="48">Low (48px)</SelectItem>
                      <SelectItem value="24">Potato (24px)</SelectItem>
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
                    className="flex-1"
                    placeholder="Tinggi kustom (px)"
                  />
                  <button
                    onClick={() => {
                      setIsCustom(false);
                      setTempHeight(96); // Reset to default
                    }}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    type="button"
                  >
                    Batal
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan nilai antara 1-1080px
                </p>
              </div>
            )}
          </div>

          {/* Audio Settings for Video */}
          {type === 'video' && (
            <div className="space-y-3 pt-3 border-t">
              <Label className="text-sm">Pengaturan Audio</Label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-muted"
                  checked={preserveAudio}
                  onChange={(e) => setPreserveAudio(e.target.checked)}
                />
                <span>Jaga Kualitas Audio</span>
              </label>
              <p className="text-xs text-muted-foreground">
                {preserveAudio 
                  ? "Audio stereo berkualitas tinggi (128kbps)"
                  : "Audio mono berkualitas rendah (32kbps)"}
              </p>
            </div>
          )}

        {/* Apply Button */}
        <button
          onClick={() => onApplySettings({ height: tempHeight, preserveAudio })}
          className="w-full h-9 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
          type="button"
        >
          Terapkan Perubahan
        </button>
      </div>
    </div>
  );
}
