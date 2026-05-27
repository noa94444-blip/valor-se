'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────
type Role = 'admin' | 'merchant' | 'customer' | null

interface NavUser {
  email: string
  role: Role
}

// ── Supabase client (browser) ──────────────────────────────
function getBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ── NavbarClient ───────────────────────────────────────────
export default function NavbarClient() {
  const [user, setUser] = useState<NavUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = getBrowserSupabase()

    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          setUser(null)
          setLoading(false)
          return
        }

        // Hämta role från profiles-tabellen
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        const role: Role = (profile?.role as Role) || 'customer'
        setUser({ email: session.user.email || '', role })
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Lyssna på auth-ändringar (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
        return
      }
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  // Vad ska visas beroende på roll
  function getAccountLink(): { label: string; href: string; icon: string } {
    if (!user) return { label: 'Logga in', href: '/logga-in', icon: '👤' }
    switch (user.role) {
      case 'admin':    return { label: 'Admin', href: '/admin', icon: '⚙️' }
      case 'merchant': return { label: 'Merchant panel', href: '/merchant', icon: '🏪' }
      default:         return { label: 'Mina sidor', href: '/konto', icon: '👤' }
    }
  }

  const accountLink = getAccountLink()

  return (
    <>
      {/* ── Desktop right side ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="navbar-desktop">
        {!loading && (
          <Link href={accountLink.href} style={{
            color: '#9B9589',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 14px',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontSize: '16px' }}>{accountLink.icon}</span>
            {accountLink.label}
          </Link>
        )}

        {!user ? (
          <Link href="/logga-in" style={{
            backgroundColor: '#C9A84C',
            color: '#0A0806',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '700',
            padding: '9px 20px',
            borderRadius: '100px',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}>
            Kom igång
          </Link>
        ) : (
          <button
            onClick={async () => {
              const supabase = getBrowserSupabase()
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(201,168,76,0.25)',
              color: '#6B6560',
              fontSize: '13px',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            Logga ut
          </button>
        )}
      </div>

      {/* ── Mobile hamburger ── */}
      <button
        className="navbar-mobile-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#C9A84C',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '4px 8px',
        }}
        aria-label="Meny"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(10,8,6,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          padding: '24px',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {[
            ['Utforska', '/deals'],
            ['Spa & Hälsa', '/deals?category=spa'],
            ['Restauranger', '/deals?category=restauranger'],
            ['Om oss', '/om-oss'],
          ].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{
              color: '#F5F2ED',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '500',
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {label}
            </Link>
          ))}

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href={accountLink.href} onClick={() => setMenuOpen(false)} style={{
              color: '#C9A84C',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              padding: '14px 0',
            }}>
              {accountLink.icon} {accountLink.label}
            </Link>

            {!user ? (
              <Link href="/logga-in" onClick={() => setMenuOpen(false)} style={{
                backgroundColor: '#C9A84C',
                color: '#0A0806',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '700',
                padding: '14px 24px',
                borderRadius: '100px',
                textAlign: 'center',
              }}>
                Kom igång
              </Link>
            ) : (
              <button
                onClick={async () => {
                  const supabase = getBrowserSupabase()
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(201,168,76,0.25)',
                  color: '#6B6560',
                  fontSize: '15px',
                  padding: '12px',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Logga ut
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop { display: none !important; }
          .navbar-mobile-toggle { display: block !important; }
          .navbar-links { display: none !important; }
        }
      `}</style>
    </>
  )
}
