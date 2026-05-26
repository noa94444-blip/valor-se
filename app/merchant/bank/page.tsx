'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function MerchantBankPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    bankgiro: '',
    iban: '',
    bank_name: '',
    account_holder: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('merchant_profiles')
        .select('bankgiro, iban, bank_name, account_holder')
        .eq('user_id', user.id)
        .single()
      if (data) setFormData({ bankgiro: data.bankgiro || '', iban: data.iban || '', bank_name: data.bank_name || '', account_holder: data.account_holder || '' })
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    await supabase
      .from('merchant_profiles')
      .upsert({ user_id: user.id, ...formData, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1A17] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1A17] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#1C1A17]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/merchant" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </Link>
          <div className="text-[#C9A84C] font-bold tracking-widest text-sm">VALÖR</div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Bankuppgifter</h1>
          <p className="text-white/50 text-sm">
            Dina bankuppgifter används för utbetalningar. Uppgifterna lagras säkert och delas inte med tredje part.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-4 mb-8 flex gap-3">
          <svg className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#C9A84C] text-sm">
            Utbetalningar sker den 1:a varje manad. Fyll i antingen BankGiro <strong>eller</strong> IBAN.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account holder */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Kontoinnehavare / Foretagsnamn
            </label>
            <input
              type="text"
              value={formData.account_holder}
              onChange={e => setFormData(p => ({ ...p, account_holder: e.target.value }))}
              placeholder="T.ex. Spa Stockholm AB"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Bank name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Bank
            </label>
            <input
              type="text"
              value={formData.bank_name}
              onChange={e => setFormData(p => ({ ...p, bank_name: e.target.value }))}
              placeholder="T.ex. Swedbank, SEB, Handelsbanken"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">KONTONUMMER</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* BankGiro */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              BankGiro
              <span className="ml-2 text-white/30 font-normal">(foredraget for svenska fretag)</span>
            </label>
            <input
              type="text"
              value={formData.bankgiro}
              onChange={e => setFormData(p => ({ ...p, bankgiro: e.target.value }))}
              placeholder="XXXXXX-XXXX"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/8 transition-all font-mono"
            />
          </div>

          {/* Or */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">ELLER</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* IBAN */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              IBAN
              <span className="ml-2 text-white/30 font-normal">(internationellt konto)</span>
            </label>
            <input
              type="text"
              value={formData.iban}
              onChange={e => setFormData(p => ({ ...p, iban: e.target.value.toUpperCase() }))}
              placeholder="SE00 0000 0000 0000 0000 0000"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/8 transition-all font-mono"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#2D5A3A] hover:bg-[#3a7049] disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all duration-200 text-sm tracking-wide"
            >
              {saving ? 'Sparar...' : saved ? 'Sparat!' : 'Spara bankuppgifter'}
            </button>
          </div>

          {saved && (
            <div className="bg-[#2D5A3A]/20 border border-[#2D5A3A]/40 rounded-xl p-4 text-center">
              <p className="text-green-400 text-sm font-medium">Bankuppgifter sparade</p>
            </div>
          )}
        </form>

        {/* Security note */}
        <div className="mt-8 flex items-start gap-3 text-white/30 text-xs">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p>Dina bankuppgifter krypteras och lagras sakert. Endast VALOR-administratorer har tillgang till dessa uppgifter for att genomfora utbetalningar.</p>
        </div>
      </div>
    </div>
  )
}
