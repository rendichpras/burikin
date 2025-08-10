# Burikin

Burikin adalah aplikasi web untuk mengompres gambar dan video secara gratis. Semua proses kompresi dilakukan di browser pengguna, tanpa menyimpan file di server.

## Fitur

### Kompresi Gambar
- Kompresi gambar dengan kualitas tinggi
- Pengaturan resolusi yang fleksibel
- Preview perbandingan sebelum/sesudah
- Mendukung format: JPG, PNG, WebP

### Kompresi Video
- Kompresi video dengan kualitas tinggi
- Pengaturan resolusi video
- Opsi kualitas audio (high/low)
- Preview thumbnail otomatis
- Mendukung format: MP4, WebM

### Keunggulan
- Antarmuka yang modern dan intuitif
- Proses kompresi cepat
- Tidak ada batasan jumlah file
- Tidak menyimpan file pengguna
- Mendukung mode gelap/terang

## Batasan
- Ukuran maksimum gambar: 10MB
- Ukuran maksimum video: 50MB
- Resolusi video: 144p, 240p
- Format yang didukung:
  - Gambar: JPG, PNG, WebP
  - Video: MP4, WebM

## Teknologi

- [Next.js 15](https://nextjs.org) - Framework React
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Shadcn/ui](https://ui.shadcn.com) - Komponen UI
- [FFmpeg.wasm](https://ffmpegwasm.github.io) - Pemrosesan video
- [Sharp](https://sharp.pixelplumbing.com) - Pemrosesan gambar

## Pengembangan Lokal

1. Clone repositori
```bash
git clone https://github.com/username/burikin.git
cd burikin
```

2. Install dependensi
```bash
npm install
# atau
pnpm install
```

3. Jalankan server development
```bash
npm run dev
# atau
pnpm dev
```

4. Buka [http://localhost:3000](http://localhost:3000)

## Lisensi

MIT License - Lihat [LICENSE](LICENSE) untuk detail lebih lanjut.