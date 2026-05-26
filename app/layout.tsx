'use client'
import { useState } from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Valor - Premium deals i din stad</title>
        <meta name="description" content="Exklusiva erbjudanden pa spa, restauranger, upplevelser och mycket mer. Kurerade premium deals i din stad." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://xn--valr-ppa.se" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Valor',
          url: 'https://xn--valr-ppa.se',
          description: 'Exklusiva erbjudanden pa spa, restauranger och upplevelser.',
          vatID: '559548-1556',
        }) }} />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#0A0806' }}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        backgroundColor: 'rgba(10,8,6,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '64px',
        }}>
          {/* Hamburger - mobil */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              display: 'none', background: 'none', border: 'none',
              color: '#F5F2ED', cursor: 'pointer', padding: '8px',
              fontSize: '22px',
            }}
            className="hamburger-btn"
            aria-label="Oppna meny"
          >
            &#9776;
          </button>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontSize: '22px', fontWeight: '900', letterSpacing: '4px',
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>VALOR</span>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/deals" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Utforska</Link>
            <Link href="/deals?kategori=Halsa" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Spa & Halsa</Link>
            <Link href="/deals?kategori=Restaurang" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Restauranger</Link>
            <Link href="/om-oss" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Om oss</Link>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/konto" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px' }} className="desktop-only">
              Mitt konto
            </Link>
            <Link href="/deals" style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
              color: '#0A0806', textDecoration: 'none', fontSize: '13px', fontWeight: '800',
              padding: '10px 20px', borderRadius: '100px', whiteSpace: 'nowrap',
            }}>
              Kom igang
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 200, backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Mobile Drawer - vanster sida */}
      <div style={{
        position: 'fixed', top: 0, left: menuOpen ? 0 : '-320px',
        width: '300px', height: '100vh',
        backgroundColor: '#0F0C08',
        borderRight: '1px solid rgba(201,168,76,0.2)',
        zIndex: 300,
        transition: 'left 0.3s ease',
        display: 'flex', flexDirection: 'column',
        padding: '0',
        overflowY: 'auto',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}>
          <span style={{
            fontSize: '18px', fontWeight: '900', letterSpacing: '4px',
            fontFamily: 'Georgia, serif',
            background: 'linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>VALOR</span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: '#9B9589', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}
            aria-label="Stang meny"
          >
            &times;
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {[
            { href: '/deals', label: 'Utforska deals' },
            { href: '/deals?kategori=Halsa', label: 'Spa & Halsa' },
            { href: '/deals?kategori=Restaurang', label: 'Restauranger' },
            { href: '/deals?kategori=Upplevelse', label: 'Upplevelser' },
            { href: '/om-oss', label: 'Om oss' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '14px 24px',
                color: '#C8C4BC', textDecoration: 'none', fontSize: '15px', fontWeight: '500',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(201,168,76,0.15)', margin: '12px 0' }} />

          {/* Account links */}
          <Link
            href="/konto"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '14px 24px',
              color: '#C9A84C', textDecoration: 'none', fontSize: '15px', fontWeight: '600',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mitt konto
          </Link>

          <Link
            href="/logga-in"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '14px 24px',
              color: '#9B9589', textDecoration: 'none', fontSize: '15px', fontWeight: '500',
            }}
          >
            Logga in / Registrera
          </Link>
        </nav>

        {/* Bottom CTA */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <Link
            href="/deals"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', textAlign: 'center',
              background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
              color: '#0A0806', textDecoration: 'none', fontSize: '13px', fontWeight: '800',
              padding: '14px 20px', borderRadius: '100px',
            }}
          >
            Se alla deals
          </Link>
        </div>
      </div>

      {/* Mobile hamburger CSS */}
      <style>{
        `@media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
        }`
      }</style>
    </>
  )
}

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#080604',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      padding: '48px 24px 32px',
      marginTop: '80px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{
              fontSize: '20px', fontWeight: '900', letterSpacing: '4px',
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: '12px',
            }}>VALOR</div>
            <p style={{ color: '#5C5650', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
              Sveriges modernaste premium marketplace for exklusiva upplevelser och deals.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>
              UTFORSKA
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/deals', label: 'Alla deals' },
                { href: '/deals?kategori=Halsa', label: 'Spa & Halsa' },
                { href: '/deals?kategori=Restaurang', label: 'Restauranger' },
                { href: '/deals?kategori=Upplevelse', label: 'Upplevelser' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>
              FORETAG
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/om-oss', label: 'Om oss' },
                { href: '/kontakt', label: 'Kontakt' },
                { href: '/integritet', label: 'Integritetspolicy' },
                { href: '/villkor', label: 'Anvandardvilkor' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Partner */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>
              PARTNER
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/avtal" style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>Bli merchant</Link>
              <Link href="/merchant" style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>Merchant dashboard</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ color: '#3C3830', fontSize: '12px', margin: 0 }}>
            2025 Valor AB. Org.nr 559548-1556. Alla rattigheter forbehallna.
          </p>
          <p style={{ color: '#3C3830', fontSize: '12px', margin: 0 }}>
            Made with love in Stockholm
          </p>
        </div>
      </div>
    </footer>
  )
}
