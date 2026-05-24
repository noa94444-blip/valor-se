'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F0E8'
const GR = '#4A7A5A'

export default function LoggaIn() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/deals')
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    if (redirect) setRedirectTo(redirect)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (loginError) throw loginError
        router.push(redirectTo)
      } else {
        const { error: registerError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://valor-se.vercel.app'}/logga-in`,
          },
        })
        if (registerError) throw registerError
        setError('Konto skapat! Kontrollera din e-post för bekräftelse.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ett fel uppstod'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: IV, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '40px', maxWidth: 400, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: G, margin: 0 }}>VALÖR</h1>
          <p style={{ color: GR, marginTop: 8, fontSize: 14 }}>
            {mode === 'login' ? 'Logga in på ditt konto' : 'Skapa ett nytt konto'}
          </p>
        </div>

        <div style={{ display: 'flex', marginBottom: 24, borderRadius: 8, overflow: 'hidden', border: `1px solid #E0D8CC` }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, backgroundColor: mode === 'login' ? G : 'white', color: mode === 'login' ? 'white' : G }}
          >
            Logga in
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, backgroundColor: mode === 'register' ? G : 'white', color: mode === 'register' ? 'white' : G }}
          >
            Registrera
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: G }}>E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0D8CC', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: G }}>Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0D8CC', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px', marginBottom: 16 }}>
              <p style={{ color: '#DC2626', fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: loading ? GR : G, color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Laddar...' : mode === 'login' ? 'Logga in' : 'Registrera'}
          </button>
        </form>

        {mode === 'login' && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <a href="#" style={{ fontSize: 13, color: GR, textDecoration: 'none' }}>Glömt lösenord?</a>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: GR }}>
          <a href="/deals" style={{ color: G, textDecoration: 'none' }}>Tillbaka till deals</a>
        </div>
      </div>
    </div>
  )
}
