// @ts-nocheck
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
                                  if (!session) { setUser(null); setLoading(false); return }

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

                const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
                        loadUser()
                })
        return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        setUser(null)
        setMenuOpen(false)
        router.push('/')
  }

  const isAdmin = user?.role === 'admin'
    const isMerchant = user?.role === 'merchant'
    const isCustomer = user?.role === 'customer'

  return (
        <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: '#0A0806',
                borderBottom: '1px solid rgba(201,168,76,0.15)',
                padding: '0 24px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
        }}>
          {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                          <span style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '22px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#C4974A',
        }}>VALÖR</span>span>
                </Link>Link>

          {/* Desktop Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
                        <Link href="/deals" style={navLinkStyle}>Utforska</Link>Link>
                        <Link href="/om-oss" style={navLinkStyle}>Om oss</Link>Link>
                        <Link href="/kontakt" style={navLinkStyle}>Kontakt</Link>Link>
                </div>div>
        
          {/* Desktop Right Side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
                {loading ? null : (
                    <>
                      {!user && (
                                    <>
                                                    <Link href="/logga-in" style={outlineBtnStyle}>Logga in</Link>Link>
                                                    <Link href="/registrera" style={goldBtnStyle}>Kom igång</Link>Link>
                                    </>>
                                  )}
                      {isCustomer && (
                                    <>
                                                    <Link href="/konto" style={outlineBtnStyle}>Mitt konto</Link>Link>
                                                    <button onClick={handleLogout} style={ghostBtnStyle}>Logga ut</button>button>
                                    </>>
                                  )}
                      {isMerchant && (
                                    <>
                                                    <Link href="/merchant" style={outlineBtnStyle}>Merchant</Link>Link>
                                                    <button onClick={handleLogout} style={ghostBtnStyle}>Logga ut</button>button>
                                    </>>
                                  )}
                      {isAdmin && (
                                    <>
                                                    <button onClick={handleLogout} style={ghostBtnStyle}>Logga ut</button>button>
                                    </>>
                                  )}
                    </>>
                  )}
              </div>div>
        
          {/* Mobile Hamburger */}
              <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="mobile-menu-btn"
                        style={{
                                    display: 'none',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    color: '#C4974A',
                                    flexDirection: 'column',
                                    gap: '5px',
                        }}
                        aria-label="Öppna meny"
                      >
                      <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: menuOpen ? 'transparent' : '#C4974A', transition: 'all 0.2s' }} />
                      <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#C4974A', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(0, -3px)' : 'none' }} />
                      <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#C4974A', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(0, 3px)' : 'none' }} />
              </button>button>
        
          {/* Mobile Menu Overlay */}
          {menuOpen && (
                  <div style={{
                              position: 'fixed',
                              top: '64px',
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: '#0A0806',
                              zIndex: 99,
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '32px 24px',
                              gap: '8px',
                  }}>
                            <MobileLink href="/deals" onClick={() => setMenuOpen(false)}>Utforska deals</MobileLink>MobileLink>
                            <MobileLink href="/om-oss" onClick={() => setMenuOpen(false)}>Om oss</MobileLink>MobileLink>
                            <MobileLink href="/kontakt" onClick={() => setMenuOpen(false)}>Kontakt</MobileLink>MobileLink>
                  
                            <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', margin: '16px 0' }} />
                  
                    {!user && (
                                <>
                                              <MobileLink href="/logga-in" onClick={() => setMenuOpen(false)}>Logga in</MobileLink>MobileLink>
                                              <Link href="/registrera" onClick={() => setMenuOpen(false)} style={{
                                                  ...goldBtnStyle,
                                                  display: 'block',
                                                  textAlign: 'center',
                                                  textDecoration: 'none',
                                                  padding: '14px 24px',
                                                  fontSize: '16px',
                                }}>Kom igång gratis →</Link>Link>
                                </>>
                              )}
                    {isCustomer && (
                                <>
                                              <MobileLink href="/konto" onClick={() => setMenuOpen(false)}>Mitt konto</MobileLink>MobileLink>
                                              <button onClick={handleLogout} style={{ ...ghostBtnStyle, textAlign: 'left', padding: '12px 0' }}>Logga ut</button>button>
                                </>>
                              )}
                    {isMerchant && (
                                <>
                                              <MobileLink href="/merchant" onClick={() => setMenuOpen(false)}>Merchant dashboard</MobileLink>MobileLink>
                                              <button onClick={handleLogout} style={{ ...ghostBtnStyle, textAlign: 'left', padding: '12px 0' }}>Logga ut</button>button>
                                </>>
                              )}
                    {isAdmin && (
                                <button onClick={handleLogout} style={{ ...ghostBtnStyle, textAlign: 'left', padding: '12px 0' }}>Logga ut</button>button>
                            )}
                  </div>div>
              )}
        
              <style>{`
                      @media (max-width: 768px) {
                                .desktop-nav { display: none !important; }
                                          .mobile-menu-btn { display: flex !important; }
                                                  }
                                                        `}</style>style>
        </nav>nav>
      )
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
          <Link href={href} onClick={onClick} style={{
                  color: '#F5F2ED',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: 500,
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(201,168,76,0.1)',
                  display: 'block',
          }}>{children}</Link>Link>
        )
}

const navLinkStyle: React.CSSProperties = {
    color: '#F5F2ED',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '0.02em',
    opacity: 0.85,
    transition: 'opacity 0.2s',
}
  
  const outlineBtnStyle: React.CSSProperties = {
      color: '#C4974A',
      border: '1px solid rgba(196,151,74,0.4)',
      borderRadius: '100px',
      padding: '8px 20px',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: 500,
      background: 'transparent',
      cursor: 'pointer',
      letterSpacing: '0.02em',
  }
    
    const goldBtnStyle: React.CSSProperties = {
        color: '#0A0806',
        backgroundColor: '#C4974A',
        borderRadius: '100px',
        padding: '8px 20px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        letterSpacing: '0.02em',
    }
      
      const ghostBtnStyle: React.CSSProperties = {
          color: '#6B7280',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 400,
          padding: '8px 12px',
      }</></></></></></></></></div>
