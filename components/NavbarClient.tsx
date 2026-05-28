'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function NavbarClient() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener?.subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '60px',
        background: 'rgba(10, 5, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 'bold',
          fontSize: '1.4rem',
          color: '#c9a227',
          textDecoration: 'none',
          letterSpacing: '0.1em',
        }}>
          VALOR
        </Link>

        {/* Desktop links */}
        <div className="valor-desktop-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}>
          <Link href="/deals" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' }}>
            Deals
          </Link>
          <Link href="/hur-det-fungerar" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' }}>
            Hur det fungerar
          </Link>
          {user ? (
            <>
              <Link href="/konto" style={{ color: '#c9a227', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>
                Mitt konto
              </Link>
              <button onClick={handleLogout} style={{
                padding: '8px 18px',
                border: '1px solid #c9a227',
                borderRadius: '6px',
                background: 'transparent',
                color: '#c9a227',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}>
                Logga ut
              </button>
            </>
          ) : (
            <Link href="/logga-in" style={{
              padding: '8px 18px',
              border: '1px solid #c9a227',
              borderRadius: '6px',
              background: 'transparent',
              color: '#c9a227',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}>
              Logga in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="valor-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#c9a227',
          }}
          aria-label="Meny"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="valor-mobile-menu" style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          zIndex: 99,
          background: 'rgba(10, 5, 0, 0.98)',
          borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <Link href="/deals" onClick={() => setMenuOpen(false)} style={{
            color: '#ccc', textDecoration: 'none', fontSize: '1.1rem', padding: '8px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            Deals
          </Link>
          <Link href="/hur-det-fungerar" onClick={() => setMenuOpen(false)} style={{
            color: '#ccc', textDecoration: 'none', fontSize: '1.1rem', padding: '8px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            Hur det fungerar
          </Link>
          {user ? (
            <>
              <Link href="/konto" onClick={() => setMenuOpen(false)} style={{
                color: '#c9a227', textDecoration: 'none', fontSize: '1.1rem', padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                Mitt konto
              </Link>
              <button onClick={handleLogout} style={{
                padding: '12px',
                border: '1px solid #c9a227',
                borderRadius: '8px',
                background: 'transparent',
                color: '#c9a227',
                cursor: 'pointer',
                fontSize: '1rem',
                textAlign: 'left',
              }}>
                Logga ut
              </button>
            </>
          ) : (
            <Link href="/logga-in" onClick={() => setMenuOpen(false)} style={{
              display: 'block',
              padding: '12px',
              border: '1px solid #c9a227',
              borderRadius: '8px',
              background: 'transparent',
              color: '#c9a227',
              textDecoration: 'none',
              fontSize: '1rem',
              textAlign: 'center',
            }}>
              Logga in
            </Link>
          )}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .valor-desktop-links { display: none !important; }
          .valor-hamburger { display: block !important; }
        }
        @media (min-width: 769px) {
          .valor-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Spacer for fixed navbar */}
      <div style={{ height: '60px' }} />
    </>
  )
}
