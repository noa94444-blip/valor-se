'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// -- Types
type Role = 'admin' | 'merchant' | 'customer' | null
interface NavUser {
  email: string
  role: Role
}

// -- NavbarClient
export default function NavbarClient() {
  const [user, setUser] = useState<NavUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          setUser(null)
          setLoading(false)
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setUser({
          email: session.user.email ?? '',
          role: (profile?.role as Role) ?? 'customer',
        })
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  function getAccountLink() {
    if (!user) return { label: 'Mina sidor', href: '/konto' }
    if (user.role === 'admin') return { label: 'Admin', href: '/admin' }
    if (user.role === 'merchant') return { label: 'Merchant panel', href: '/merchant' }
    return { label: 'Mina sidor', href: '/konto' }
  }

  const al = getAccountLink()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const navLinks: [string, string][] = [
    ['Utforska', '/deals'],
    ['Restaurang', '/deals?category=restaurang'],
    ['Om oss', '/om-oss'],
  ]

  const baseNavStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(10,8,6,0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(201,168,76,0.12)',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  return (
    <>
      {/* Desktop */}
      <nav className="vn-desktop" style={{ ...baseNavStyle, padding: '0 24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '4px', color: '#C9A84C', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>VALOR</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          {navLinks.map(([lbl, href]) => (
            <Link key={href} href={href} style={{ color: '#C9C5BE', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              {lbl}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!loading && (
            !user ? (
              <>
                <Link href="/logga-in" style={{ color: '#C9C5BE', textDecoration: 'none', fontSize: '14px', padding: '8px 18px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px' }}>
                  Logga in
                </Link>
                <Link href="/logga-in" style={{ backgroundColor: '#C9A84C', color: '#0A0806', textDecoration: 'none', fontSize: '14px', fontWeight: '700', padding: '8px 18px', borderRadius: '100px' }}>
                  Kom igang
                </Link>
              </>
            ) : (
              <>
                <Link href={al.href} style={{ color: '#C9C5BE', textDecoration: 'none', fontSize: '14px', padding: '8px 18px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px' }}>
                  {al.label}
                </Link>
                <button onClick={handleSignOut} style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: '#6B6560', fontSize: '13px', padding: '8px 18px', borderRadius: '100px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Logga ut
                </button>
              </>
            )
          )}
        </div>
      </nav>

      {/* Mobile toggle bar */}
      <nav className="vn-mobile" style={{ ...baseNavStyle, display: 'none', padding: '0 16px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '4px', color: '#C9A84C', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>VALOR</span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meny"
          style={{ background: 'transparent', border: 'none', color: '#C9A84C', fontSize: '22px', cursor: 'pointer', padding: '4px 8px' }}
        >
          {menuOpen ? 'X' : '='}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, backgroundColor: 'rgba(10,8,6,0.98)', backdropFilter: 'blur(20px)', padding: '20px 24px', zIndex: 99, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map(([lbl, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ color: '#C9C5BE', textDecoration: 'none', fontSize: '16px', fontWeight: '500', padding: '12px 0', borderBottom: '1px solid rgba(201,168,76,0.07)' }}
            >
              {lbl}
            </Link>
          ))}
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!loading && (
              !user ? (
                <>
                  <Link
                    href="/logga-in"
                    onClick={() => setMenuOpen(false)}
                    style={{ backgroundColor: '#C9A84C', color: '#0A0806', textDecoration: 'none', fontSize: '16px', fontWeight: '700', padding: '13px 20px', borderRadius: '100px', textAlign: 'center' }}
                  >
                    Kom igang
                  </Link>
                  <Link
                    href="/logga-in"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#C9C5BE', textDecoration: 'none', fontSize: '15px', padding: '11px 20px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px', textAlign: 'center' }}
                  >
                    Logga in
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={al.href}
                    onClick={() => setMenuOpen(false)}
                    style={{ backgroundColor: '#C9A84C', color: '#0A0806', textDecoration: 'none', fontSize: '16px', fontWeight: '700', padding: '13px 20px', borderRadius: '100px', textAlign: 'center' }}
                  >
                    {al.label}
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleSignOut() }}
                    style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: '#6B6560', fontSize: '15px', padding: '11px 20px', borderRadius: '100px', cursor: 'pointer', width: '100%' }}
                  >
                    Logga ut
                  </button>
                </>
              )
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .vn-desktop { display: none !important; }
          .vn-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .vn-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
