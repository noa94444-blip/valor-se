'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NavbarClient() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setUser(null)
          setLoading(false)
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setUser({ email: session.user.email, role: profile?.role || 'customer' })
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        router.push('/')
      } else if (event === 'SIGNED_IN') {
        loadUser()
      }
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const accountLink = user ? (user.role === 'merchant' ? '/merchant' : '/konto') : '/logga-in'
  const accountLabel = user ? (user.role === 'merchant' ? 'Merchant' : 'Mitt konto') : 'Logga in'

  return (
    <nav className="valor-navbar">
      <div className="valor-navbar-inner">
        <Link href="/" className="valor-logo">VALOR</Link>
        <div className="valor-desktop-links">
          <Link href="/deals" className="valor-nav-link">Deals</Link>
          <Link href="/how-it-works" className="valor-nav-link">Hur det fungerar</Link>
          {!loading && user && (
            <div className="valor-user-actions">
              <Link href={accountLink} className="valor-account-link">{accountLabel}</Link>
              <button onClick={handleLogout} className="valor-logout-btn">Logga ut</button>
            </div>
          )}
          {!loading && !user && (
            <Link href="/logga-in" className="valor-login-btn">Logga in</Link>
          )}
        </div>
        <button className="valor-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="valor-mobile-menu">
          <Link href="/deals" className="valor-mobile-link" onClick={() => setMenuOpen(false)}>Deals</Link>
          <Link href="/how-it-works" className="valor-mobile-link" onClick={() => setMenuOpen(false)}>Hur det fungerar</Link>
          {user ? (
            <div>
              <Link href={accountLink} className="valor-mobile-account" onClick={() => setMenuOpen(false)}>{accountLabel}</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="valor-mobile-logout">Logga ut</button>
            </div>
          ) : (
            <Link href="/logga-in" className="valor-mobile-account" onClick={() => setMenuOpen(false)}>Logga in</Link>
          )}
        </div>
      )}
      <style>{`
        .valor-navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(196,151,74,0.2);
        }
        .valor-navbar-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; height: 64px;
        }
        .valor-logo {
          font-size: 22px; font-weight: 700; color: #C4974A;
          letter-spacing: 0.08em; text-decoration: none;
        }
        .valor-desktop-links { display: flex; gap: 32px; align-items: center; }
        .valor-nav-link { color: #e5e5e5; text-decoration: none; font-size: 14px; }
        .valor-user-actions { display: flex; gap: 16px; align-items: center; }
        .valor-account-link { color: #C4974A; text-decoration: none; font-size: 14px; font-weight: 600; }
        .valor-logout-btn {
          background: transparent; border: 1px solid rgba(196,151,74,0.4);
          color: #C4974A; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;
        }
        .valor-login-btn {
          background: #C4974A; color: #0a0a0a; padding: 8px 20px;
          border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 600;
        }
        .valor-hamburger {
          display: none; background: transparent; border: none; color: #C4974A; cursor: pointer; padding: 8px;
        }
        .valor-mobile-menu {
          border-top: 1px solid rgba(196,151,74,0.15); padding: 16px 24px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .valor-mobile-link { color: #e5e5e5; text-decoration: none; font-size: 15px; }
        .valor-mobile-account { color: #C4974A; text-decoration: none; font-size: 15px; font-weight: 600; display: block; }
        .valor-mobile-logout {
          background: transparent; border: none; color: #C4974A;
          text-align: left; cursor: pointer; font-size: 15px; padding: 0;
        }
        @media (max-width: 768px) {
          .valor-desktop-links { display: none; }
          .valor-hamburger { display: block; }
        }
      `}</style>
    </nav>
  )
}
