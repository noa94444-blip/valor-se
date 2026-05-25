// @ts-nocheck
import type { Metadata } from 'next'
import './globals.css'
import SupportChat from '../components/SupportChat'

export const metadata: Metadata = {
  title: 'Valör – Premium deals i din stad',
  description: 'Hitta exklusiva deals på spa, restauranger, upplevelser och mer. Kurerade erbjudanden för den kräsne.',
  keywords: 'deals, erbjudanden, spa, restauranger, Göteborg, Sverige, premium',
  openGraph: {
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva deals på spa, restauranger och upplevelser.',
    type: 'website',
    locale: 'sv_SE',
    url: 'https://valor-se.vercel.app',
    siteName: 'Valör',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva deals på spa, restauranger och upplevelser.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://valor-se.vercel.app',
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Valör",
              "url": "https://valor-se.vercel.app",
              "description": "Premium deals på spa, restauranger och upplevelser i Sverige",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://valor-se.vercel.app/deals?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body style={{ backgroundColor: '#F5F2ED', color: '#26231F' }} className="font-body antialiased">
        {children}
        <SupportChat />
      </body>
    </html>
  )
}
