'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

export default function KontoPage() {
  const [user, setUser] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('vouchers')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/logga-in')
        return
      }
      setUser(session.user)
      const { data: voucherData } = await supabase
        .from('vouchers')
        .select('*, deal:deals(title, merchant_name, price, original_price, image_url, expires_at)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setVouchers(voucherData || [])
      const { data: orderData } = await supabase
        .from('orders')
        .select('*, deal:deals(title, merchant_name, price)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setOrders(orderData || [])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Okant datum'
    return new Date(dateStr).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getDaysLeft = (expiresAt) => {
    if (!expiresAt) return null
    const diff = new Date(expiresAt).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Utgangen'
    if (days === 0) return 'Sista dagen!'
    if (days === 1) return '1 dag kvar'
    if (days <= 7) return days + ' dagar kvar'
    return null
  }

  const getUrgencyColor = (expiresAt) => {
    if (!expiresAt) return '#10B981'
    const diff = new Date(expiresAt).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return '#6b7280'
    if (days <= 3) return '#EF4444'
    if (days <= 7) return '#F59E0B'
    return '#10B981'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C4974A', fontSize: 18 }}>Laddar ditt konto...</div>
      </div>
    )
  }

  const activeVouchers = vouchers.filter(v => v.status === 'active')
  const usedVouchers = vouchers.filter(v => v.status === 'used')

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#C4974A', margin: 0 }}>Mitt konto</h1>
            <p style={{ color: '#9ca3af', marginTop: 4, marginBottom: 0 }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(196,151,74,0.4)', color: '#C4974A', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>
            Logga ut
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 4 }}>
          {['vouchers', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '10px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, background: activeTab === tab ? '#C4974A' : 'transparent', color: activeTab === tab ? '#0a0a0a' : '#9ca3af', transition: 'all 0.2s' }}
            >
              {tab === 'vouchers' ? 'Mina vouchers (' + vouchers.length + ')' : 'Orderhistorik (' + orders.length + ')'}
            </button>
          ))}
        </div>

        {activeTab === 'vouchers' && (
          <div>
            {vouchers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
                <h3 style={{ color: '#C4974A', marginBottom: 8 }}>Inga vouchers an</h3>
                <p style={{ color: '#6b7280', marginBottom: 24 }}>Utforska vara deals och kop din forsta voucher!</p>
                <Link href="/deals" style={{ background: '#C4974A', color: '#0a0a0a', padding: '12px 28px', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}>
                  Se alla deals
                </Link>
              </div>
            ) : (
              <div>
                {activeVouchers.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e5e5e5', marginBottom: 16 }}>Aktiva vouchers ({activeVouchers.length})</h2>
                    <div style={{ display: 'grid', gap: 16 }}>
                      {activeVouchers.map(v => {
                        const daysLeft = getDaysLeft(v.deal?.expires_at)
                        const urgencyColor = getUrgencyColor(v.deal?.expires_at)
                        return (
                          <div key={v.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,151,74,0.2)', borderRadius: 12, padding: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0 }}>
                              <QRCodeSVG value={'VALOR-' + v.code} size={120} bgColor="#0a0a0a" fgColor="#C4974A" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e5e5e5', margin: 0 }}>{v.deal?.title || 'Deal'}</h3>
                                <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>AKTIV</span>
                              </div>
                              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>{v.deal?.merchant_name}</p>
                              <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#C4974A', fontWeight: 700, marginBottom: 12, letterSpacing: '0.1em' }}>
                                {v.code}
                              </div>
                              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280' }}>
                                <span>Kopt: {formatDate(v.created_at)}</span>
                                {v.deal?.expires_at && <span>Utgar: {formatDate(v.deal.expires_at)}</span>}
                              </div>
                              {daysLeft && (
                                <div style={{ marginTop: 12, display: 'inline-block', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + urgencyColor, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: urgencyColor, fontWeight: 600 }}>
                                  {daysLeft}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                {usedVouchers.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: '#6b7280', marginBottom: 16 }}>Anvanda vouchers ({usedVouchers.length})</h2>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {usedVouchers.map(v => (
                        <div key={v.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{v.deal?.title || 'Deal'}</div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>{v.deal?.merchant_name} - Anvand: {formatDate(v.used_at)}</div>
                          </div>
                          <span style={{ background: 'rgba(107,114,128,0.2)', color: '#6b7280', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>ANVAND</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ color: '#C4974A', marginBottom: 8 }}>Ingen orderhistorik</h3>
                <p style={{ color: '#6b7280' }}>Dina kop kommer att visas har.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {orders.map(order => (
                  <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,151,74,0.1)', borderRadius: 12, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{order.deal?.title || 'Order'}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{order.deal?.merchant_name} - {formatDate(order.created_at)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#C4974A' }}>{order.amount_paid || order.deal?.price} kr</div>
                      <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>{order.status || 'Genomford'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
