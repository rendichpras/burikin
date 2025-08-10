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
  const extension = originalName.split('.').pop() || '';
  const baseName = originalName.slice(0, -(extension.length + 1));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center gap-2 w-full h-11 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-colors">
          <FileDown className="w-4 h-4" />
          <span className="font-medium">Export {type === 'image' ? 'Gambar' : 'Video'}</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export {type === 'image' ? 'Gambar' : 'Video'}</DialogTitle>
          <DialogDescription>
            Pilih format output yang diinginkan
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-2">
            <Label>Format Output</Label>
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
                        <span className="text-xs text-muted-foreground">
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
            className="w-full inline-flex items-center justify-center h-11 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Simpan {type === 'image' ? 'Gambar' : 'Video'}
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}