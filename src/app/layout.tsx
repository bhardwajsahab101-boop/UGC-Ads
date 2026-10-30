import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://lumeflowcreative.com'),
  title: 'LumeFlow Creative | AI UGC-Style Video Ads for E-commerce Brands',
  description:
    'Explore creator-style product video ads, creative concepts, and short-form advertising production for skincare, pet-product, and e-commerce brands.',
  keywords: [
    'AI UGC video ads',
    'creator video ads',
    'ecommerce video ads',
    'skincare UGC ads',
    'pet product video ads',
    'short form advertising',
    'DTC video production',
    'Meta ads creative',
    'TikTok video ads',
  ],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lumeflowcreative.com',
    title: 'LumeFlow Creative | AI UGC-Style Video Ads for E-commerce Brands',
    description:
      'Scroll-stopping video concepts, product-focused storytelling, and human-reviewed creative execution — designed to help brands test their next advertising idea.',
    siteName: siteConfig.brandName,
    images: [
      {
        url: '/media/studio_hero_visual.jpg',
        width: 1200,
        height: 675,
        alt: 'LumeFlow Creative advertising studio showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LumeFlow Creative | AI UGC-Style Video Ads for E-commerce Brands',
    description:
      'Explore creator-style product video ads, creative concepts, and short-form advertising production for skincare and pet DTC brands.',
    images: ['/media/studio_hero_visual.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#090a0c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
