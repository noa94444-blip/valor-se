// @ts-nocheck
'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return

      setStatus('loading')
        try {
                const res = await fetch('/api/newsletter', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, name }),
                })
                const data = await res.json()
                if (res.ok) {
                          setStatus('success')
                          setMessage(data.message ?? 'Tack! Du ar nu prenumerant.')
                          setEmail('')
                          setName('')
                } else {
                          setStatus('error')
                          setMessage(data.error ?? 'Nagot gick fel.')
                }
        } catch {
                setStatus('error')
                setMessage('Kunde inte ansluta. Forsok igen.')
        }
  }

  return (
        <section style={{
                background: 'linear-gradient(135deg, rgba(196,151,74,0.08) 0%, rgba(196,151,74,0.03) 100%)',
                border: '1px solid rgba(196,151,74,0.2)',
                borderRadius: 20,
                padding: '48px 40px',
                maxWidth: 560,
                margin: '0 auto',
                textAlign: 'center',
        }}>
          {/* Icon */}
                <div style={{ fontSize: 32, marginBottom: 16 }}>✦</div>div>

                <h2 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#F5F2ED',
                  margin: '0 0 8px',
                  lineHeight: 1.3,
        }}>
                          Fa deals fore alla andra
                </h2>h2>
                <p style={{ color: '#9CA3AF', fontSize: 15, margin: '0 0 32px', lineHeight: 1.6 }}>
                          Prenumerera och fa exklusiva erbjudanden direkt i inkorgen.
                          Inga spams — bara premium deals.
                </p>p>

          {status === 'success' ? (
                  <div style={{
                              background: 'rgba(16,185,129,0.1)',
                              border: '1px solid rgba(16,185,129,0.3)',
                              borderRadius: 12,
                              padding: '16px 24px',
                              color: '#10B981',
                              fontWeight: 500,
                  }}>
                    {message}
                  </div>div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                              <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Ditt fornamn (valfritt)"
                                            style={inputStyle}
                                          />
                              <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Din e-postadress"
                                            required
                                            style={inputStyle}
                                          />
                              <button
                                            type="submit"
                                            disabled={status === 'loading' || !email}
                                            style={{
                                                            backgroundColor: status === 'loading' ? '#9CA3AF' : '#C4974A',
                                                            color: '#0A0806',
                                                            border: 'none',
                                                            borderRadius: 100,
                                                            padding: '14px 32px',
                                                            fontSize: 15,
                                                            fontWeight: 700,
                                                            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s',
                                                            letterSpacing: '0.02em',
                                            }}
                                          >
                                {status === 'loading' ? 'Skickar...' : 'Prenumerera gratis →'}
                              </button>button>
                  
                    {status === 'error' && (
                                <p style={{ color: '#EF4444', fontSize: 13, margin: 0 }}>{message}</p>p>
                            )}
                  
                            <p style={{ color: '#4B5563', fontSize: 12, margin: '8px 0 0', lineHeight: 1.5 }}>
                                        Genom att prenumerera godkanner du var{' '}
                                        <a href="/integritet" style={{ color: '#6B7280', textDecoration: 'underline' }}>
                                                      integritetspolicy
                                        </a>a>
                                        . Du kan avprenumerera nar som helst.
                            </p>p>
                  </form>form>
              )}
        </section>section>
      )
}

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(196,151,74,0.25)',
    borderRadius: 10,
    color: '#F5F2ED',
    fontSize: 15,
    padding: '12px 16px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
}</button>
