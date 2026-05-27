// @ts-nocheck
import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Valör – Premium deals i din stad',
  description: 'Exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0A0806', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          backgroundColor: 'rgba(10,8,6,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          padding: '0 24px',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <span style={{
              fontSize: '22px', fontWeight: '900', letterSpacing: '4px',
              color: '#C9A84C', fontFamily: 'Georgia, serif', textTransform: 'uppercase',
            }}>
              VALÖR
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link href="/deals" style={navLink}>Utforska</Link>
            <Link href="/deals?category=spa" style={navLink}>Spa & Hälsa</Link>
            <Link href="/deals?category=restauranger" style={navLink}>Restauranger</Link>
            <Link href="/om-oss" style={navLink}>Om oss</Link>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link href="/konto" style={{
              color: '#9B9589',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 14px',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              Mina sidor
            </Link>
            <Link href="/logga-in" style={{
              backgroundColor: '#C9A84C',
              color: '#0A0806',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '700',
              padding: '9px 20px',
              borderRadius: '100px',
              letterSpacing: '0.02em',
            }}>
              Kom igång
            </Link>
          </div>
        </nav>

        {/* Page content */}
        {children}

        {/* ── FOOTER ── */}
        <footer style={{
          backgroundColor: '#060504',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          padding: '64px 24px 40px',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
              <div>
                <p style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '4px', color: '#C9A84C', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>VALÖR</p>
                <p style={{ color: '#4A4540', fontSize: '13px', lineHeight: '1.7', maxWidth: '220px' }}>
                  Sveriges modernaste premium marketplace för deals och upplevelser.
                </p>
              </div>
              <div>
                <p style={{ color: '#6B6560', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>UTFORSKA</p>
                {[['Alla deals', '/deals'], ['Spa & Hälsa', '/deals?category=spa'], ['Restauranger', '/deals?category=restauranger'], ['Upplevelser', '/deals?category=upplevelser']].map(([label, href]) => (
                  <Link key={label} href={href} style={{ display: 'block', color: '#4A4540', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>{label}</Link>
                ))}
              </div>
              <div>
                <p style={{ color: '#6B6560', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>FÖRETAG</p>
                {[['Om oss', '/om-oss'], ['Bli merchant', '/merchant'], ['Kontakt', '/kontakt']].map(([label, href]) => (
                  <Link key={label} href={href} style={{ display: 'block', color: '#4A4540', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>{label}</Link>
                ))}
              </div>
              <div>
                <p style={{ color: '#6B6560', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>PARTNER</p>
                {[['Bli merchant', '/merchant'], ['Logga in', '/logga-in'], ['Mina sidor', '/konto']].map(([label, href]) => (
                  <Link key={label} href={href} style={{ display: 'block', color: '#4A4540', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>{label}</Link>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ color: '#2A2520', fontSize: '13px' }}>© 2026 Valör AB. Alla rättigheter förbehållna.</p>
              <div style={{ display: 'flex', gap: '24px' }}>
                {[['Villkor', '/villkor'], ['Integritet', '/integritet'], ['Avtal', '/avtal']].map(([label, href]) => (
                  <Link key={label} href={href} style={{ color: '#2A2520', textDecoration: 'none', fontSize: '13px' }}>{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}

const navLink = {
  color: '#9B9589',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 14px',
  borderRadius: '8px',
}
