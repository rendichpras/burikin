import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ]
};

export const metadata: Metadata = {
  title: "Burikin - Kompresi Gambar & Video Online Gratis",
  description: "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda. Mendukung format JPG, PNG, WebP, MP4, dan WebM.",
  keywords: ["kompresi gambar", "kompresi video", "kompres gambar online", "kompres video online", "image compression", "video compression"],
  authors: [{ name: "Rendi Ichtiar Prasetyo" }],
  openGraph: {
    title: "Burikin - Kompresi Gambar & Video Online Gratis",
    description: "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda.",
    url: "https://burikin.rendiichtiar.com",
    siteName: "Burikin",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burikin - Kompresi Gambar & Video Online Gratis",
    description: "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda.",
  },
  robots: "index, follow",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Burikin"
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}