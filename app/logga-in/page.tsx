'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  const supabase = createClient()

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
        // Kolla roll och redirecta admin till /admin
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
          .single()
        const role = profileData?.role ?? 'customer'
        if (role === 'admin') {
          router.push('/admin')
        } else if (role === 'merchant') {
          router.push('/merchant')
        } else {
          router.push(redirectTo)
        }
      } else {
        const { error: regError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (regError) throw regError
        setError('Kolla din e-post för bekräftelselänk!')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Något gick fel')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: IV, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: 32, color: G, textAlign: 'center', marginBottom: 8 }}>VALÖR</h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: 24 }}>Logga in på ditt konto</p>

        <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: 8, padding: 4, marginBottom: 24 }}>
          <button
            onClick={() => setMode('login')}
            style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer', background: mode === 'login' ? G : 'transparent', color: mode === 'login' ? 'white' : '#666', fontWeight: 500 }}
          >Logga in</button>
          <button
            onClick={() => setMode('register')}
            style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer', background: mode === 'register' ? G : 'transparent', color: mode === 'register' ? 'white' : '#666', fontWeight: 500 }}
          >Registrera</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: G }}>E-post</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 15, background: IV, boxSizing: 'border-box' }}
              placeholder="din@email.se"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: G }}>Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 15, background: IV, boxSizing: 'border-box' }}
              placeholder="••••••••••••••"
            />
          </div>

          {error && <p style={{ color: error.includes('e-post') ? GR : 'red', marginBottom: 12, fontSize: 14 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px 0', background: G, color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Laddar...' : mode === 'login' ? 'Logga in' : 'Registrera'}
          </button>
        </form>

        {mode === 'login' && (
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/aterstall-losenord" style={{ color: AU }}>Glömt lösenord?</a>
          </p>
        )}

        <p style={{ textAlign: 'center', marginTop: 12 }}>
          <a href="/deals" style={{ color: '#888' }}>Tillbaka till deals</a>
        </p>
      </div>
    </div>
  )
}
