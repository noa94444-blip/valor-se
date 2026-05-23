'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegistreraPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setError('')
    // TODO: integrate with Supabase auth
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-forest mb-3">Välkommen till Valör!</h1>
          <p className="text-forest/60 mb-2">Vi har skickat ett bekräftelsemail till</p>
          <p className="text-forest font-medium mb-8">{email}</p>
          <Link href="/logga-in" className="bg-forest text-ivory px-8 py-4 rounded-2xl text-sm font-medium hover:bg-forest/90 transition-colors">
            Logga in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <Link href="/" className="font-display text-2xl text-forest tracking-wide">
          Valör
        </Link>
        <Link href="/logga-in" className="text-forest/60 hover:text-forest text-sm transition-colors">
          Logga in
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-forest mb-3">Skapa konto</h1>
            <p className="text-forest/60 text-sm">
              {step === 1 ? 'Kom igång med Valör på under en minut.' : 'Välj ett säkert lösenord.'}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-1.5 rounded-full bg-forest" />
            <div className={`w-8 h-1.5 rounded-full transition-colors ${step === 2 ? 'bg-forest' : 'bg-forest/20'}`} />
          </div>

          {/* Google SSO */}
          {step === 1 && (
            <>
              <button className="w-full flex items-center justify-center gap-3 bg-white border border-forest/20 text-forest py-3.5 rounded-2xl text-sm font-medium hover:bg-forest/5 transition-colors mb-4 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Fortsätt med Google
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-forest/10" />
                <span className="text-forest/40 text-xs">eller med e-post</span>
                <div className="flex-1 h-px bg-forest/10" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-xs text-forest/50 uppercase tracking-wider mb-2">Ditt namn</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Anna Lindgren"
                    required
                    className="w-full border border-forest/20 rounded-2xl px-4 py-3.5 text-forest text-sm placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-champagne/50 focus:border-champagne/50 bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-forest/50 uppercase tracking-wider mb-2">E-post</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="din@email.se"
                    required
                    className="w-full border border-forest/20 rounded-2xl px-4 py-3.5 text-forest text-sm placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-champagne/50 focus:border-champagne/50 bg-white transition-all"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="bg-forest/5 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center">
                    <span className="text-forest text-sm font-semibold">{name[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="text-forest text-sm font-medium">{name}</div>
                    <div className="text-forest/50 text-xs">{email}</div>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="ml-auto text-forest/40 hover:text-forest text-xs transition-colors">
                    Ändra
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-forest/50 uppercase tracking-wider mb-2">Lösenord</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minst 8 tecken"
                    minLength={8}
                    required
                    className="w-full border border-forest/20 rounded-2xl px-4 py-3.5 text-forest text-sm placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-champagne/50 focus:border-champagne/50 bg-white transition-all"
                  />
                  {password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full transition-colors ${
                            password.length > i * 2 + 1
                              ? password.length < 6 ? 'bg-red-400' : password.length < 10 ? 'bg-yellow-400' : 'bg-green-500'
                              : 'bg-forest/10'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-ivory py-4 rounded-2xl text-sm font-medium hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Skapar konto...
                </span>
              ) : step === 1 ? 'Fortsätt' : 'Skapa konto'}
            </button>
          </form>

          {step === 1 && (
            <p className="text-center text-forest/50 text-sm mt-6">
              Redan medlem?{' '}
              <Link href="/logga-in" className="text-forest font-medium hover:text-champagne transition-colors">
                Logga in
              </Link>
            </p>
          )}

          {step === 2 && (
            <p className="text-center text-forest/30 text-xs mt-6">
              Genom att skapa konto godkänner du våra{' '}
              <Link href="/villkor" className="underline">villkor</Link>{' '}
              och{' '}
              <Link href="/integritet" className="underline">integritetspolicy</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
