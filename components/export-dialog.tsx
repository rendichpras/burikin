'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ExportDialogProps {
  file: File | null;
  resultUrl: string | null;
  type: 'image' | 'video';
}

export function ExportDialog({ file, resultUrl, type }: ExportDialogProps) {
  const imageFormats = [
    { value: 'jpeg', label: 'JPEG', recommended: true },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' }
  ];

  const videoFormats = [
    { value: 'mp4', label: 'MP4', recommended: true },
    { value: 'webm', label: 'WebM' }
  ];

  const formats = type === 'image' ? imageFormats : videoFormats;
  const [format, setFormat] = useState(formats[0].value);

  if (!file || !resultUrl) return null;

  const originalName = file.name;
  const extension = originalName.includes('.') ? originalName.split('.').pop() || '' : '';
  const baseName = extension ? originalName.slice(0, -(extension.length + 1)) : originalName;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-sm bg-primary/20 text-primary border-2 border-primary hover:bg-primary/30 transition-all duration-200 font-semibold shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-0 active:translate-y-0 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <FileDown className="w-4 h-4" />
          <span>Unduh {type === 'image' ? 'Gambar' : 'Video'}</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">Unduh {type === 'image' ? 'Gambar' : 'Video'}</DialogTitle>
          <DialogDescription className="font-medium">
            Pilih format hasil yang diinginkan
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-2">
            <Label>Format Hasil</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    <span className="flex items-center gap-2">
                      {f.label}
                      {f.recommended && (
                        <span className="text-xs text-muted-foreground font-medium">
                          Direkomendasikan
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <a
            href={resultUrl}
            download={`${baseName}-lowres.${format}`}
            className="w-full inline-flex items-center justify-center h-12 px-4 rounded-sm bg-primary text-primary-foreground border-2 border-primary hover:bg-primary/90 transition-all duration-200 font-semibold shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-0 active:translate-y-0 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          >
            Simpan {type === 'image' ? 'Gambar' : 'Video'}
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}