'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const LG = '#E8E4DE'
const ER = '#DC2626'
const WA = '#92400E'

function LoggaInForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || null
    const urlError = searchParams.get('error')

  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [name, setName] = useState('')

  useEffect(() => {
        if (urlError === 'rate_limited') {
                setError('For manga forsok. Vanligen vanta 15 minuter och forsok igen.')
        } else if (urlError === 'account_suspended') {
                setError('Ditt konto har spärrats. Kontakta support.')
        }
  }, [urlError])

  async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !password) {
                setError('Fyll i e-post och losenord.')
                return
        }
        setLoading(true)
        setError('')

      if (mode === 'login') {
              const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
              if (authError) {
                        setError('Fel e-post eller losenord. Forsok igen.')
                        setLoading(false)
                        return
              }
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

          const role = profile?.role || 'customer'
              if (redirectTo) {
                        router.push(redirectTo)
              } else if (role === 'admin') {
                        router.push('/admin')
              } else if (role === 'merchant') {
                        router.push('/merchant')
              } else {
                        router.push('/konto')
              }
      } else {
              const { data, error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: { data: { full_name: name } }
              })
              if (signUpError) {
                        setError(signUpError.message)
                        setLoading(false)
                        return
              }
              if (data.user) {
                        await supabase.from('profiles').upsert({
                                    id: data.user.id,
                                    email,
                                    full_name: name,
                                    role: 'customer'
                        })
                        router.push('/konto')
              }
      }
        setLoading(false)
  }

  return (
        <div style={{ minHeight: '100vh', backgroundColor: IV, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: 24 }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                          <div style={{ textAlign: 'center', marginBottom: 40 }}>
                                      <a href="/" style={{ textDecoration: 'none' }}>
                                                    <div style={{ fontSize: 32, fontFamily: 'Georgia, serif', color: G, letterSpacing: 2 }}>Valor</div>div>
                                                    <div style={{ fontSize: 11, letterSpacing: 4, color: AU, textTransform: 'uppercase', marginTop: 4 }}>Premium Deals</div>div>
                                      </a>a>
                          </div>div>

                          <div style={{ backgroundColor: WH, borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                                      <div style={{ display: 'flex', borderBottom: `1px solid ${LG}`, marginBottom: 28 }}>
                                                    <button onClick={() => setMode('login')} style={{ flex: 1, padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: mode === 'login' ? G : GR, borderBottom: mode === 'login' ? `2px solid ${G}` : '2px solid transparent', fontFamily: 'Inter, sans-serif', fontWeight: mode === 'login' ? 600 : 400 }}>
                                                                    Logga in
                                                    </button>button>
                                                    <button onClick={() => setMode('register')} style={{ flex: 1, padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: mode === 'register' ? G : GR, borderBottom: mode === 'register' ? `2px solid ${G}` : '2px solid transparent', fontFamily: 'Inter, sans-serif', fontWeight: mode === 'register' ? 600 : 400 }}>
                                                                    Skapa konto
                                                    </button>button>
                                      </div>div>

                                      <form onSubmit={handleSubmit}>
                                        {mode === 'register' && (
                        <div style={{ marginBottom: 16 }}>
                                          <label style={{ display: 'block', fontSize: 13, color: G, marginBottom: 6, fontWeight: 500 }}>Namn</label>label>
                                          <input type="text" value={name} onChange={e => setName(e.target.value)} required={mode === 'register'}
                                                              placeholder="Ditt namn"
                                                              style={{ width: '100%', padding: '12px 16px', border: `1px solid ${LG}`, borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                        </div>div>
                      )}
                                                    <div style={{ marginBottom: 16 }}>
                                                                    <label style={{ display: 'block', fontSize: 13, color: G, marginBottom: 6, fontWeight: 500 }}>E-postadress</label>label>
                                                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                                                                      placeholder="din@email.se"
                                                                                      style={{ width: '100%', padding: '12px 16px', border: `1px solid ${LG}`, borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                                                    </div>div>
                                                    <div style={{ marginBottom: 24 }}>
                                                                    <label style={{ display: 'block', fontSize: 13, color: G, marginBottom: 6, fontWeight: 500 }}>Losenord</label>label>
                                                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                                                                                      placeholder="Minst 6 tecken"
                                                                                      style={{ width: '100%', padding: '12px 16px', border: `1px solid ${LG}`, borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                                                    </div>div>

                                        {error && (
                        <div style={{ backgroundColor: urlError === 'rate_limited' ? '#FFFBEB' : '#FEF2F2', border: `1px solid ${urlError === 'rate_limited' ? '#FDE68A' : '#FECACA'}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: urlError === 'rate_limited' ? WA : ER, fontSize: 13 }}>
                          {error}
                        </div>div>
                      )}

                                                    <button type="submit" disabled={loading}
                                                                    style={{ width: '100%', padding: '14px', backgroundColor: G, color: AU, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: loading ? 0.7 : 1 }}>
                                                      {loading ? 'Laddar...' : mode === 'login' ? 'Logga in' : 'Skapa konto'}
                                                    </button>button>
                                      </form>form>

                            {mode === 'login' && (
                      <div style={{ textAlign: 'center', marginTop: 20 }}>
                                      <a href="#" style={{ fontSize: 13, color: AU, textDecoration: 'none' }}>Glömt lösenordet?</a>a>
                      </div>div>
                    )}
                          </div>div>

                          <div style={{ textAlign: 'center', marginTop: 24 }}>
                                      <a href="/deals" style={{ fontSize: 13, color: GR, textDecoration: 'none' }}>← Tillbaka till deals</a>a>
                          </div>div>
                </div>div>
        </div>div>
      )
}

export default function LoggaInPage() {
    return (
          <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#1A3A2A', fontFamily: 'Georgia, serif', fontSize: 24 }}>Laddar...</div>div></div>div>}>
                <LoggaInForm />
          </Suspense>Suspense>
        )
}</Suspense>
