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
        <footer style={{ background: '#26231F', color: '#F5F2ED', padding: '48px 24px 32px', marginTop: '0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '40px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px', marginBottom: '12px' }}>VALÖR</div>
                <p style={{ color: '#8B8680', fontSize: '13px', lineHeight: '1.6', maxWidth: '200px' }}>
                  Premium deals i din stad. Kurerade erbjudanden för den kräsne.
                </p>
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#8B8680', marginBottom: '12px' }}>Utforska</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[['Alla deals', '/deals'], ['Om oss', '/om-oss'], ['Bli partner', '/avtal']].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#C8C4BE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    >{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#8B8680', marginBottom: '12px' }}>Support</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[['Kontakta oss', '/kontakt'], ['Villkor', '/villkor'], ['Integritetspolicy', '/integritet']].map(([label, href]) => (
                    <a key={href} href={href} style={{ color: '#C8C4BE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    >{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#8B8680', marginBottom: '12px' }}>Kontakt</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="mailto:support@valor.se" style={{ color: '#C8C4BE', textDecoration: 'none', fontSize: '13px' }}>support@valor.se</a>
                  <a href="mailto:partner@valor.se" style={{ color: '#C8C4BE', textDecoration: 'none', fontSize: '13px' }}>partner@valor.se</a>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #3A3630', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ color: '#6B6560', fontSize: '12px' }}>© 2026 Valör Sverige AB. Alla rättigheter förbehållna.</span>
              <span style={{ color: '#6B6560', fontSize: '12px' }}>Byggt med ❤️ i Sverige</span>
            </div>
          </div>
        </footer>
        <SupportChat />
      </body>
    </html>
  )
}
