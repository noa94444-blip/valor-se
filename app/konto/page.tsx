'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

function getTimeLeft(expiresAt) {
  if (!expiresAt) return null
  const diff = new Date(expiresAt) - new Date()
  if (diff <= 0) return 'Utgången'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return days + ' dagar kvar'
  if (hours > 0) return hours + ' timmar kvar'
  return 'Sista dagen!'
}

export default function KontoPage() {
  const [user, setUser] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('vouchers')
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/logga-in?redirect=/konto')
        return
      }
      setUser(user)

      const { data: vouchersData } = await supabase
        .from('vouchers')
        .select('*, deals(title, merchant_name, original_price, discounted_price)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, deals(title, merchant_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setVouchers(vouchersData || [])
      setOrders(ordersData || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0806' }}>
        <p style={{ color: '#c9a227', fontSize: '1.1rem' }}>Laddar ditt konto...</p>
      </div>
    )
  }

  const activeVouchers = vouchers.filter(v => v.status === 'active')
  const usedVouchers = vouchers.filter(v => v.status === 'used')

  return (
    <div style={{ minHeight: '100vh', background: '#0A0806', padding: '32px 24px', maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#c9a227', fontFamily: 'Georgia, serif', fontSize: '2rem', margin: 0 }}>Mitt konto</h1>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: '0.9rem' }}>{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: '8px 20px', border: '1px solid #555', borderRadius: 8, background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Logga ut
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderRadius: 10, overflow: 'hidden', border: '1px solid #222' }}>
        <button
          onClick={() => setActiveTab('vouchers')}
          style={{
            flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
            background: activeTab === 'vouchers' ? '#c9a227' : '#111',
            color: activeTab === 'vouchers' ? '#000' : '#aaa',
          }}
        >
          Mina vouchers ({vouchers.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
            background: activeTab === 'orders' ? '#c9a227' : '#111',
            color: activeTab === 'orders' ? '#000' : '#aaa',
          }}
        >
          Orderhistorik ({orders.length})
        </button>
      </div>

      {/* Vouchers tab */}
      {activeTab === 'vouchers' && (
        <div>
          {vouchers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎟️</div>
              <h3 style={{ color: '#c9a227', marginBottom: 8, fontFamily: 'Georgia, serif' }}>Inga vouchers än</h3>
              <p style={{ color: '#6b7280', marginBottom: 24 }}>Utforska våra deals och köp din första voucher!</p>
              <Link href="/deals" style={{
                display: 'inline-block', padding: '12px 28px',
                background: '#c9a227', color: '#000', borderRadius: 8,
                textDecoration: 'none', fontWeight: 'bold',
              }}>
                Se alla deals
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {vouchers.map(voucher => {
                const timeLeft = getTimeLeft(voucher.expires_at)
                const isExpired = timeLeft === 'Utgången'
                const isUrgent = timeLeft && timeLeft.includes('timmar')
                return (
                  <div key={voucher.id} style={{
                    background: '#111', borderRadius: 12,
                    border: isExpired ? '1px solid #333' : '1px solid rgba(201,162,39,0.3)',
                    padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap',
                    opacity: isExpired ? 0.6 : 1,
                  }}>
                    {/* QR Code */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
                        <QRCodeSVG value={voucher.qr_code || voucher.id} size={120} />
                      </div>
                      <span style={{ color: '#888', fontSize: '0.75rem' }}>
                        {voucher.status === 'used' ? '✓ Använd' : 'Visa vid besök'}
                      </span>
                    </div>
                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h3 style={{ color: '#fff', marginBottom: 4, fontFamily: 'Georgia, serif' }}>
                        {voucher.deals?.title || 'Deal'}
                      </h3>
                      <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 12px' }}>
                        {voucher.deals?.merchant_name}
                      </p>

                      {timeLeft && (
                        <div style={{
                          display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                          background: isExpired ? '#1a1a1a' : isUrgent ? '#3a1a00' : '#1a2a00',
                          color: isExpired ? '#555' : isUrgent ? '#ff6b00' : '#c9a227',
                          fontSize: '0.85rem', fontWeight: 600, marginBottom: 12,
                        }}>
                          {isUrgent ? '⚠️ ' : '⏰ '}{timeLeft}
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {voucher.created_at && (
                          <p style={{ color: '#666', fontSize: '0.8rem', margin: 0 }}>
                            Köpt: {new Date(voucher.created_at).toLocaleDateString('sv-SE')}
                          </p>
                        )}
                        {voucher.expires_at && (
                          <p style={{ color: '#666', fontSize: '0.8rem', margin: 0 }}>
                            Gäller till: {new Date(voucher.expires_at).toLocaleDateString('sv-SE')}
                          </p>
                        )}
                        <p style={{ color: '#c9a227', fontSize: '0.85rem', fontWeight: 600, margin: '4px 0 0' }}>
                          {voucher.deals?.discounted_price ? voucher.deals.discounted_price + ' kr' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
              <h3 style={{ color: '#c9a227', marginBottom: 8, fontFamily: 'Georgia, serif' }}>Inga orders än</h3>
              <p style={{ color: '#6b7280', marginBottom: 24 }}>Dina köp kommer att visas här.</p>
              <Link href="/deals" style={{
                display: 'inline-block', padding: '12px 28px',
                background: '#c9a227', color: '#000', borderRadius: 8,
                textDecoration: 'none', fontWeight: 'bold',
              }}>
                Utforska deals
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map(order => (
                <div key={order.id} style={{
                  background: '#111', borderRadius: 10,
                  border: '1px solid #222', padding: '16px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
                }}>
                  <div>
                    <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{order.deals?.title || 'Deal'}</p>
                    <p style={{ color: '#888', margin: '4px 0 0', fontSize: '0.85rem' }}>{order.deals?.merchant_name}</p>
                    <p style={{ color: '#666', margin: '4px 0 0', fontSize: '0.8rem' }}>
                      {new Date(order.created_at).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#c9a227', fontWeight: 'bold', margin: 0 }}>{order.amount} kr</p>
                    <span style={{
                      display: 'inline-block', marginTop: 4, padding: '2px 10px',
                      borderRadius: 20, fontSize: '0.8rem',
                      background: order.status === 'paid' ? '#1a3a1a' : '#1a1a2a',
                      color: order.status === 'paid' ? '#4caf50' : '#888',
                    }}>
                      {order.status === 'paid' ? '✓ Betald' : order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
