import type { Metadata } from 'next'
import './globals.css'
import NavbarClient from '@/components/NavbarClient'

const baseUrl = 'https://xn--valr-7qa.se'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Valör – Premium deals i din stad',
    template: '%s | Valör',
  },
  description: 'Valör erbjuder exklusiva deals på restauranger, spa, fitness och upplevelser i din stad. Spara upp till 50% – inga månadsavgifter.',
  keywords: [
    'deals', 'rabatt', 'restaurang', 'spa', 'fitness', 'upplevelser',
    'Stockholm', 'Göteborg', 'Malmö', 'Sverige', 'premium deals',
    'valör', 'erbjudanden', 'kupong', 'rabattkod',
  ],
  authors: [{ name: 'Noa', url: baseUrl }],
  creator: 'Noa',
  publisher: 'Valör AB',
  category: 'deals',
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
    url: baseUrl,
    siteName: 'Valör',
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva deals på restauranger, spa, fitness och upplevelser. Spara upp till 50% utan månadsavgift.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Valör – Premium deals i din stad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva deals på restauranger, spa, fitness och upplevelser.',
    images: ['/og-image.jpg'],
    creator: '@valordeals',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'sv-SE': baseUrl,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  verification: {
    google: '',
  },
  other: {
    'theme-color': '#0A0806',
    'color-scheme': 'dark',
    'msapplication-TileColor': '#0A0806',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Valör',
      description: 'Premium deals på restauranger, spa och upplevelser i Sverige',
      inLanguage: 'sv-SE',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/deals?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Valör AB',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 60,
      },
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hello@xn--valr-7qa.se',
        availableLanguage: 'Swedish',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${baseUrl}/#webpage`,
      url: baseUrl,
      name: 'Valör – Premium deals i din stad',
      isPartOf: { '@id': `${baseUrl}/#website` },
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: 'sv-SE',
      description: 'Hitta och boka exklusiva deals på restauranger, spa, fitness och upplevelser i din stad.',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={baseUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, backgroundColor: '#0A0806' }}>
        <NavbarClient />
        {children}
      </body>
    </html>
  )
}
