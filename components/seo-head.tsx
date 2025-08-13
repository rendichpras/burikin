'use client';

import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function SEOHead({
  title = "Burikin - Kompresi Gambar & Video Online Gratis",
  description = "Kompres gambar dan video secara gratis, tanpa watermark, dan tanpa menyimpan file Anda. Mendukung format JPG, PNG, WebP, MP4, dan WebM.",
  keywords = ["kompresi gambar", "kompresi video", "kompres gambar online", "kompres video online"],
  image = "/android-chrome-512x512.png",
  url = "/",
  type = "website"
}: SEOHeadProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Burikin",
    "description": description,
    "url": url,
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
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Rendi Ichtiar Prasetyo" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://burikin.rendiichtiar.com${url}`} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`https://burikin.rendiichtiar.com${image}`} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:site_name" content="Burikin" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://burikin.rendiichtiar.com${image}`} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#FF6B35" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Burikin" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://burikin.rendiichtiar.com${url}`} />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
}
