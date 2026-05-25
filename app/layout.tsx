// @ts-nocheck
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://xn--valr-7qa.se'),
  title: {
    default: 'Valör – Premium deals i din stad',
    template: '%s | Valör',
  },
  description: 'Exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer. Kurerade premium deals i din stad.',
  keywords: ['deals', 'erbjudanden', 'spa', 'restauranger', 'upplevelser', 'Stockholm', 'Sverige', 'rabatt', 'premium'],
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
    url: 'https://xn--valr-7qa.se',
    siteName: 'Valör',
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser.',
    creator: '@valor_se',
  },
  alternates: {
    canonical: 'https://xn--valr-7qa.se',
  },
  verification: {
    google: '',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Valör',
              url: 'https://xn--valr-7qa.se',
              logo: 'https://xn--valr-7qa.se/logo.png',
              description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser.',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'support@xn--valr-7qa.se',
                contactType: 'customer service',
                availableLanguage: 'Swedish',
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#F5F2ED' }}>
        {/* Navigation */}
        <nav style={{
          backgroundColor: '#F5F2ED',
          borderBottom: '1px solid #E2DDD6',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontSize: '22px',
                fontWeight: '900',
                color: '#26231F',
                letterSpacing: '3px',
                fontFamily: 'Georgia, serif',
              }}>
                VALÖR
              </span>
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <a href="/deals" style={{ color: '#26231F', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Utforska</a>
              <a href="/deals?kategori=Halsa" style={{ color: '#26231F', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Spa</a>
              <a href="/deals?kategori=Restaurang" style={{ color: '#26231F', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Restauranger</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a href="/logga-in" style={{
                color: '#26231F',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 16px',
              }}>
                Logga in
              </a>
              <a href="/deals" style={{
                backgroundColor: '#4A6741',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '10px 20px',
                borderRadius: '8px',
              }}>
                Kom igång
              </a>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer style={{ backgroundColor: '#26231F', color: '#F5F2ED', padding: '60px 24px 30px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '3px', fontFamily: 'Georgia, serif' }}>VALÖR</span>
                <p style={{ color: '#9B9589', fontSize: '14px', marginTop: '12px', lineHeight: '1.6' }}>
                  Premium deals kurerade för dig som värdesätter kvalitet och upplevelser.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Utforska</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="/deals" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Alla deals</a>
                  <a href="/deals?kategori=Halsa" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Spa & Hälsa</a>
                  <a href="/deals?kategori=Restaurang" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Restauranger</a>
                  <a href="/deals?kategori=Upplevelse" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Upplevelser</a>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Företag</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="/om-oss" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Om oss</a>
                  <a href="/merchant" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Bli partner</a>
                  <a href="/kontakt" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Kontakt</a>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Juridiskt</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="/villkor" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Villkor</a>
                  <a href="/integritet" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px' }}>Integritetspolicy</a>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #3A3530', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ color: '#6B6560', fontSize: '13px' }}>© 2026 Valör. Alla rättigheter förbehållna.</p>
              <p style={{ color: '#6B6560', fontSize: '13px' }}>Gjord med ❤️ i Sverige</p>
            </div>
          </div>
        </footer>

        {/* AI Support Chat */}
        <SupportChat />
      </body>
    </html>
  )
}

function SupportChat() {
  return null
}
