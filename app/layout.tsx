// @ts-nocheck
'use client'
import { useState } from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Valör – Premium deals i din stad</title>
        <meta name="description" content="Exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer. Kurerade premium deals i din stad." />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Valör',
          url: 'https://xn--valr-7qa.se',
          description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser.',
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
          {/* Hamburger — mobil */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              display: 'none', background: 'none', border: 'none',
              color: '#F5F2ED', cursor: 'pointer', padding: '8px',
              fontSize: '22px',
            }}
            className="hamburger-btn"
            aria-label="Öppna meny"
          >
            ☰
          </button>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontSize: '22px', fontWeight: '900', letterSpacing: '4px',
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>VALÖR</span>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/deals" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Utforska</Link>
            <Link href="/deals?kategori=Halsa" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Spa & Hälsa</Link>
            <Link href="/deals?kategori=Restaurang" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Restauranger</Link>
            <Link href="/om-oss" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Om oss</Link>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/logga-in" style={{ color: '#9B9589', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px' }} className="desktop-only">
              Logga in
            </Link>
            <Link href="/deals" style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
              color: '#0A0806', textDecoration: 'none', fontSize: '13px', fontWeight: '800',
              padding: '10px 20px', borderRadius: '100px', whiteSpace: 'nowrap',
            }}>
              Kom igång
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer — vänster sida */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 200, backdropFilter: 'blur(4px)',
          }}
        />
      )}
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
          padding: '20px 24px', borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <span style={{
            fontSize: '20px', fontWeight: '900', letterSpacing: '3px',
            fontFamily: 'Georgia, serif',
            background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>VALÖR</span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: '#6B6560', fontSize: '24px', cursor: 'pointer' }}
          >✕</button>
        </div>

        {/* Drawer links */}
        <div style={{ padding: '16px 0', flex: 1 }}>
          {[
            { href: '/deals', icon: '🔍', label: 'Alla deals' },
            { href: '/deals?kategori=Halsa', icon: '🧘', label: 'Spa & Hälsa' },
            { href: '/deals?kategori=Skonhet', icon: '💆', label: 'Skönhet' },
            { href: '/deals?kategori=Restaurang', icon: '🍽️', label: 'Restauranger' },
            { href: '/deals?kategori=Upplevelse', icon: '✨', label: 'Upplevelser' },
            { href: '/deals?kategori=Hotell', icon: '🏨', label: 'Hotell' },
            { href: '/om-oss', icon: '💎', label: 'Om oss' },
            { href: '/kontakt', icon: '📧', label: 'Kontakt' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 24px', textDecoration: 'none',
                color: '#F5F2ED', fontSize: '15px', fontWeight: '500',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div style={{ padding: '24px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <Link href="/logga-in" onClick={() => setMenuOpen(false)} style={{
            display: 'block', textAlign: 'center', padding: '12px',
            border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px',
            color: '#C9A84C', textDecoration: 'none', fontSize: '14px', fontWeight: '700',
            marginBottom: '12px',
          }}>Logga in</Link>
          <Link href="/merchant" onClick={() => setMenuOpen(false)} style={{
            display: 'block', textAlign: 'center', padding: '12px',
            background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
            borderRadius: '100px', color: '#0A0806', textDecoration: 'none',
            fontSize: '14px', fontWeight: '800',
          }}>Bli partner</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
        }
      `}</style>
    </>
  )
}

function Footer() {
  return (
    <footer style={{ backgroundColor: '#050403', borderTop: '1px solid rgba(201,168,76,0.1)', padding: '60px 24px 30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          <div>
            <span style={{
              fontSize: '20px', fontWeight: '900', letterSpacing: '3px', fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>VALÖR</span>
            <p style={{ color: '#6B6560', fontSize: '13px', marginTop: '12px', lineHeight: '1.7' }}>
              Premium deals kurerade för dig som värdesätter kvalitet och upplevelser.
            </p>
            <p style={{ color: '#4A4540', fontSize: '12px', marginTop: '12px' }}>Org.nr: 559548-1556</p>
          </div>
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Utforska</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[['/', 'Hem'], ['/deals', 'Alla deals'], ['/deals?kategori=Halsa', 'Spa & Hälsa'], ['/deals?kategori=Restaurang', 'Restauranger'], ['/deals?kategori=Upplevelse', 'Upplevelser']].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Företag</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[['/om-oss', 'Om oss'], ['/merchant', 'Bli partner'], ['/kontakt', 'Kontakt']].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Juridiskt</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[['/villkor', 'Allmänna villkor'], ['/integritet', 'Integritetspolicy'], ['/villkor', 'Cookiepolicy']].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: '#6B6560', textDecoration: 'none', fontSize: '13px' }}>{label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#4A4540', fontSize: '12px' }}>© 2026 Valör AB · Org.nr 559548-1556 · Alla rättigheter förbehållna.</p>
          <p style={{ color: '#4A4540', fontSize: '12px' }}>Gjord med ❤️ i Sverige</p>
        </div>
      </div>
    </footer>
  )
}
