// @ts-nocheck
import type { Metadata } from 'next'
import './globals.css'
import NavbarClient from '@/components/NavbarClient'

export const metadata: Metadata = {
  title: 'Valör – Premium deals i din stad',
  description: 'Exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer.',
  keywords: ['deals', 'rabatt', 'spa', 'restaurang', 'Sverige', 'premium'],
  openGraph: {
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser.',
    url: 'https://valor-se.vercel.app',
    siteName: 'Valör',
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0A0806" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0A0806', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

        {/* Navbar */}
        <NavbarClient />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(201,168,76,0.1)',
          padding: '48px 24px',
          marginTop: '80px',
          backgroundColor: '#0A0806',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: '#c9a227',
              letterSpacing: '0.1em',
            }}>
              VALOR
            </div>
            <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
              {new Date().getFullYear()} Valör AB. Alla rättigheter förbehållna.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/villkor" style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none' }}>Villkor</a>
              <a href="/integritet" style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none' }}>Integritet</a>
              <a href="/kontakt" style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none' }}>Kontakt</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
