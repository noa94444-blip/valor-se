import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: {
      default: 'Valör – Premium deals i din stad',
          template: '%s | Valör',
    },
    description: 'Hitta exklusiva deals på spa, restauranger, upplevelser och mer. Kurerade erbjudanden för den kräsne kunden i Stockholm, Göteborg och Malmö.',
    keywords: 'deals, erbjudanden, spa, restauranger, upplevelser, Stockholm, Göteborg, Malmö, Sverige, premium, voucher, rabatt',
    authors: [{ name: 'Valör' }],
    creator: 'Valör',
    publisher: 'Valör',
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
    openGraph: {
          type: 'website',
          locale: 'sv_SE',
          url: 'https://www.xn--valr-7qa.se',
          siteName: 'Valör',
          title: 'Valör – Premium deals i din stad',
          description: 'Exklusiva deals på spa, restauranger och upplevelser. Upplev mer. Betala mindre.',
          images: [
            {
                      url: 'https://valor-se.vercel.app/og-image.png',
                      width: 1200,
                      height: 630,
                      alt: 'Valör – Premium deals',
            },
                ],
    },
    twitter: {
          card: 'summary_large_image',
          title: 'Valör – Premium deals i din stad',
          description: 'Exklusiva deals på spa, restauranger och upplevelser.',
          images: ['https://valor-se.vercel.app/og-image.png'],
    },
    alternates: {
          canonical: 'https://www.xn--valr-7qa.se',
    },
    icons: {
          icon: [
            { url: '/favicon.ico' },
            { url: '/icon.png', type: 'image/png', sizes: '32x32' },
                ],
          apple: [
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
                ],
    },
    manifest: '/manifest.json',
    themeColor: '#1A3A2A',
    viewport: {
          width: 'device-width',
          initialScale: 1,
          maximumScale: 5,
    },
    category: 'shopping',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
          <html lang="sv">
                <head>
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                        <link
                                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=DM+Serif+Display&display=swap"
                                    rel="stylesheet"
                                  />
                        <meta name="format-detection" content="telephone=no" />
                        <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{
                                                  __html: JSON.stringify({
                                                                  "@context": "https://schema.org",
                                                                  "@type": "WebSite",
                                                                  "name": "Valör",
                                                                  "url": "https://www.xn--valr-7qa.se",
                                                                  "description": "Premium deals på spa, restauranger och upplevelser i Sverige",
                                                                  "potentialAction": {
                                                                                    "@type": "SearchAction",
                                                                                    "target": "https://www.xn--valr-7qa.se/deals?q={search_term_string}",
                                                                                    "query-input": "required name=search_term_string"
                                                                  }
                                                  })
                                    }}
                                  />
                </head>head>
                <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#F5F2ED', WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}>
                  {children}
                </body>body>
          </html>html>
        )
}</html>
