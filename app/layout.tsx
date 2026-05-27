// @ts-nocheck
import type { Metadata } from 'next'
import './globals.css'
import NavbarClient from '@/components/NavbarClient'

export const metadata: Metadata = {
  title: 'Valor - Premium deals i din stad',
  description: 'Exklusiva erbjudanden pa spa, restauranger, upplevelser och mycket mer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
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
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '4px', color: '#C9A84C', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>VALOR</span>
            <p style={{ color: '#6B6560', fontSize: '13px', margin: 0 }}>
              {new Date().getFullYear()} Valor AB. Alla rattigheter forbehallna.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/villkor" style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>Villkor</a>
              <a href="/integritet" style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>Integritet</a>
              <a href="/kontakt" style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>Kontakt</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
