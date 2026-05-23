import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Valör – Premium deals i din stad',
  description: 'Hitta exklusiva deals på spa, restauranger, upplevelser och mer. Kurerade erbjudanden för den kräsne.',
  keywords: 'deals, erbjudanden, spa, restauranger, Göteborg, Sverige, premium',
  openGraph: {
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva deals på spa, restauranger och upplevelser.',
    type: 'website',
    locale: 'sv_SE',
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
      </head>
      <body className="bg-canvas-100 text-canvas-800 font-body antialiased">
        {children}
      </body>
    </html>
  )
}
