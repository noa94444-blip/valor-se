// @ts-nocheck
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'VALÖR – Premium deals i din stad',
    template: '%s | VALÖR'
  },
  description: 'Hitta de bästa lokala erbjudandena på bilservice, restauranger, skönhet och mer. Spara upp till 50% med VALÖR.',
  keywords: ['deals', 'erbjudanden', 'rabatter', 'stockholm', 'bilservice', 'restaurang', 'skönhet', 'spa'],
  authors: [{ name: 'VALÖR' }],
  creator: 'VALÖR',
  publisher: 'VALÖR',
  metadataBase: new URL('https://valor-se.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VALÖR – Premium deals i din stad',
    description: 'Hitta de bästa lokala erbjudandena. Spara upp till 50% med VALÖR.',
    url: 'https://valor-se.vercel.app',
    siteName: 'VALÖR',
    locale: 'sv_SE',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VALÖR – Premium deals i din stad',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VALÖR – Premium deals i din stad',
    description: 'Hitta de bästa lokala erbjudandena. Spara upp till 50% med VALÖR.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
  },
  category: 'shopping',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'VALÖR',
              url: 'https://valor-se.vercel.app',
              description: 'Premium deals och erbjudanden i din stad',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://valor-se.vercel.app/deals?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              },
              publisher: {
                '@type': 'Organization',
                name: 'VALÖR',
                url: 'https://valor-se.vercel.app',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://valor-se.vercel.app/logo.png'
                }
              }
            })
          }}
        />
      </head>
      <body className={inter.className} style={{ margin: 0, background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
