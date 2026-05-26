'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const MERCHANT_SHARE = 0.85

function fmt(n: number) {
  return (n || 0).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function MerchantPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ordRes, dealRes, payRes, vouRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('deals').select('*'),
        supabase.from('payouts').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('vouchers').select('id, status, deal_slug'),
      ])
      setOrders(ordRes.data || [])
      setDeals(dealRes.data || [])
      setPayouts(payRes.data || [])
      setVouchers(vouRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const confirmed = orders.filter(o => o.status === 'confirmed' || o.status === 'completed')
  const pending = orders.filter(o => o.status === 'pending')
  const grossRevenue = confirmed.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
  const merchantEarnings = grossRevenue * MERCHANT_SHARE
  const unpaidOrders = confirmed.filter(o => !o.payout_id)
  const upcomingPayout = unpaidOrders.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0) * MERCHANT_SHARE
  const activeDeals = deals.filter(d => d.status === 'active')
  const usedVouchers = vouchers.filter(v => v.status === 'fully_used' || v.status === 'redeemed').length

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      <header style={{ background: '#1C1A17', borderBottom: '1px solid #2a2825', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: '#C9A84C', fontWeight: 900, fontSize: 18, letterSpacing: 2, textDecoration: 'none' }}>VALOR</Link>
          <span style={{ background: '#C9A84C22', color: '#C9A84C', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, border: '1px solid #C9A84C40', letterSpacing: 1 }}>HANDLARPORTAL</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          <Link href="/merchant" style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Oversikt</Link>
          <Link href="/merchant/scanner" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Skanna kupong</Link>
          <Link href="/merchant/bank" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Bankuppgifter</Link>
          <Link href="/deals" style={{ color: '#555', fontSize: 12, textDecoration: 'none' }}>Hemsida</Link>
        </nav>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1C1A17', marginBottom: 8 }}>Handlarportal</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>Oversikt over din forsaljning</p>

        {loading ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>Laddar...</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e0d8' }}>
                <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', marginBottom: 8 }}>Aktiva erbjudanden</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#1C1A17' }}>{activeDeals.length}</p>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e0d8' }}>
                <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', marginBottom: 8 }}>Sald totalt</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#1C1A17' }}>{confirmed.length} st</p>
              </div>
              <div style={{ background: '#1C1A17', borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 11, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>Din intjaning</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#C9A84C' }}>{fmt(merchantEarnings)} kr</p>
              </div>
              <div style={{ background: '#2D5A3A', borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 11, color: '#7fc99b', textTransform: 'uppercase', marginBottom: 8 }}>Kommande utbetalning</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{fmt(upcomingPayout)} kr</p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e0d8' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1C1A17', marginBottom: 16 }}>
                Senaste ordrar ({orders.length} totalt)
              </h2>
              {orders.slice(0, 20).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f2ed' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#1C1A17' }}>{o.customer_email || o.customer_name || 'Anonym'}</p>
                    <p style={{ fontSize: 12, color: '#999' }}>{o.deal_slug} · {new Date(o.created_at).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: '#1C1A17' }}>{fmt(parseFloat(o.amount) || 0)} kr</p>
                    <p style={{ fontSize: 11, color: o.status === 'confirmed' ? '#2D5A3A' : o.status === 'pending' ? '#C9A84C' : '#999', fontWeight: 600 }}>
                      {o.status?.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>Inga ordrar an</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
