import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8F8" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL('https://burikin.rendiichtiar.com'),
  title: "Burikin - Kompresi Gambar & Video Online Gratis",
  description: "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda. Mendukung format JPG, PNG, WebP, MP4, dan WebM.",
  keywords: ["kompresi gambar", "kompresi video", "kompres gambar online", "kompres video online", "image compression", "video compression", "kompres file", "kompres ukuran file"],
  authors: [{ name: "Rendi Ichtiar Prasetyo" }],
  creator: "Rendi Ichtiar Prasetyo",
  publisher: "Burikin",
  openGraph: {
    title: "Burikin - Kompresi Gambar & Video Online Gratis",
    description: "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda.",
    url: "/",
    siteName: "Burikin",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Burikin - Kompresi Gambar & Video Online"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Burikin - Kompresi Gambar & Video Online Gratis",
    description: "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda.",
    images: ["/android-chrome-512x512.png"]
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
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
  },
  verification: {
    google: "your-google-verification-code", // Ganti dengan kode verifikasi Google Search Console
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Burikin",
    "description": "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda",
    "url": "https://burikin.rendiichtiar.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    },
    "author": {
      "@type": "Person",
      "name": "Rendi Ichtiar Prasetyo"
    },
    "creator": {
      "@type": "Person",
      "name": "Rendi Ichtiar Prasetyo"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Burikin"
    },
    "featureList": [
      "Kompresi gambar JPG, PNG, WebP",
      "Kompresi video MP4, WebM",
      "Tanpa watermark",
      "Tanpa menyimpan file",
      "Gratis"
    ]
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-background flex flex-col font-medium`}
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