// @ts-nocheck
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'qrcode'

// -- Types
interface VoucherRow {
    id: string
    code: string
    status: string
    used_at: string | null
    created_at: string
    expires_at: string | null
    deal: {
      title: string
      merchant_name: string
      price: number
      original_price: number
      image_url?: string
    } | null
}

interface OrderRow {
    id: string
    amount: number
    status: string
    created_at: string
    deal_title?: string
}

// -- Countdown hook
function useCountdown(expiresAt: string | null) {
    const [timeLeft, setTimeLeft] = useState('')
    const [urgency, setUrgency] = useState<'normal' | 'soon' | 'critical'>('normal')

  useEffect(() => {
        if (!expiresAt) { setTimeLeft(''); return }

                function calc() {
                        const diff = new Date(expiresAt!).getTime() - Date.now()
                        if (diff <= 0) { setTimeLeft('Utgangen'); setUrgency('critical'); return }

          const days = Math.floor(diff / 86400000)
                        const hours = Math.floor((diff % 86400000) / 3600000)
                        const mins = Math.floor((diff % 3600000) / 60000)

          if (days > 7) { setTimeLeft(`${days} dagar kvar`); setUrgency('normal') }
                        else if (days > 1) { setTimeLeft(`${days} dagar kvar`); setUrgency('soon') }
                        else if (days === 1) { setTimeLeft(`1 dag ${hours} timmar kvar`); setUrgency('critical') }
                        else if (hours > 0) { setTimeLeft(`${hours} tim ${mins} min kvar`); setUrgency('critical') }
                        else { setTimeLeft(`${mins} minuter kvar`); setUrgency('critical') }
                }

                calc()
        const interval = setInterval(calc, 60000)
        return () => clearInterval(interval)
  }, [expiresAt])

  return { timeLeft, urgency }
}

// -- QR Display component
function QRDisplay({ code }: { code: string }) {
    const [qrUrl, setQrUrl] = useState('')

  useEffect(() => {
        QRCode.toDataURL(code, {
                width: 200,
                margin: 2,
                color: { dark: '#0A0806', light: '#F5F2ED' },
        }).then(setQrUrl).catch(() => setQrUrl(''))
  }, [code])

  if (!qrUrl) return (
        <div style={{ width: 160, height: 160, background: '#1a1612', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#6B7280', fontSize: 12 }}>Laddar QR...</span>span>
        </div>div>
      )

  return (
        <div style={{ background: '#F5F2ED', padding: 12, borderRadius: 8, display: 'inline-block' }}>
                <img src={qrUrl} alt={`QR-kod: ${code}`} style={{ width: 160, height: 160, display: 'block' }} />
        </div>div>
      )
}

// -- VoucherCard component
function VoucherCard({ voucher }: { voucher: VoucherRow }) {
    const [expanded, setExpanded] = useState(false)
    const { timeLeft, urgency } = useCountdown(voucher.expires_at)
    const isUsed = voucher.status === 'used'
    const isExpired = voucher.status === 'expired' || (voucher.expires_at && new Date(voucher.expires_at) < new Date())

  const urgencyColor = urgency === 'critical' ? '#EF4444' : urgency === 'soon' ? '#F59E0B' : '#10B981'

  return (
        <div style={{
                background: isUsed || isExpired ? 'rgba(255,255,255,0.03)' : 'rgba(196,151,74,0.06)',
                border: `1px solid ${isUsed || isExpired ? 'rgba(255,255,255,0.08)' : 'rgba(196,151,74,0.2)'}`,
                borderRadius: 12,
                padding: '20px',
                marginBottom: 16,
                opacity: isUsed || isExpired ? 0.6 : 1,
                transition: 'all 0.2s',
        }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            {/* Status badge */}
                                      <div style={{ marginBottom: 8 }}>
                                        {isUsed && <span style={badgeStyle('#6B7280')}>Använd</span>span>}
                                        {isExpired && !isUsed && <span style={badgeStyle('#EF4444')}>Utgången</span>span>}
                                        {!isUsed && !isExpired && <span style={badgeStyle('#10B981')}>Aktiv</span>span>}
                                      </div>div>

                                      <h3 style={{ margin: '0 0 4px', color: '#F5F2ED', fontSize: 16, fontWeight: 600 }}>
                                        {voucher.deal?.title ?? 'Deal'}
                                      </h3>h3>
                                      <p style={{ margin: '0 0 8px', color: '#9CA3AF', fontSize: 13 }}>
                                        {voucher.deal?.merchant_name}
                                      </p>p>

                            {/* Countdown */}
                            {timeLeft && !isUsed && !isExpired && (
                      <div style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 6,
                                      background: `${urgencyColor}15`,
                                      border: `1px solid ${urgencyColor}40`,
                                      borderRadius: 100,
                                      padding: '4px 10px',
                                      marginBottom: 8,
                      }}>
                                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: urgencyColor, display: 'inline-block' }} />
                                      <span style={{ color: urgencyColor, fontSize: 12, fontWeight: 600 }}>{timeLeft}</span>span>
                      </div>div>
                    )}

                                      <div style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>
                                                    Köpt: {new Date(voucher.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                      </div>div>
                            {voucher.expires_at && (
                      <div style={{ color: '#6B7280', fontSize: 12 }}>
                                      Giltig till: {new Date(voucher.expires_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>div>
                    )}
                            {voucher.deal && (
                      <div style={{ color: '#C4974A', fontSize: 13, fontWeight: 600, marginTop: 6 }}>
                        {voucher.deal.price} kr
                        {voucher.deal.original_price > voucher.deal.price && (
                                        <span style={{ color: '#6B7280', fontWeight: 400, textDecoration: 'line-through', marginLeft: 8, fontSize: 12 }}>
                                          {voucher.deal.original_price} kr
                                        </span>span>
                                      )}
                      </div>div>
                    )}
                          </div>div>

                  {/* Show QR button */}
                  {!isUsed && !isExpired && (
                    <button
                                  onClick={() => setExpanded(!expanded)}
                                  style={{
                                                  background: expanded ? '#C4974A' : 'rgba(196,151,74,0.1)',
                                                  border: '1px solid rgba(196,151,74,0.3)',
                                                  borderRadius: 8,
                                                  color: expanded ? '#0A0806' : '#C4974A',
                                                  cursor: 'pointer',
                                                  padding: '8px 14px',
                                                  fontSize: 12,
                                                  fontWeight: 600,
                                                  whiteSpace: 'nowrap',
                                                  transition: 'all 0.2s',
                                  }}
                                >
                      {expanded ? 'Dölj QR' : 'Visa QR'}
                    </button>button>
                        )}
                </div>div>
        
          {/* QR Code expanded */}
          {expanded && !isUsed && !isExpired && (
                  <div style={{
                              marginTop: 20,
                              paddingTop: 20,
                              borderTop: '1px solid rgba(196,151,74,0.15)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 12,
                  }}>
                            <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>
                                        Visa denna kod för personalen vid besöket
                            </p>p>
                            <QRDisplay code={voucher.code} />
                            <div style={{
                                background: 'rgba(196,151,74,0.1)',
                                border: '1px solid rgba(196,151,74,0.2)',
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontFamily: 'monospace',
                                fontSize: 16,
                                letterSpacing: '0.15em',
                                color: '#C4974A',
                                fontWeight: 700,
                  }}>
                              {voucher.code}
                            </div>div>
                  </div>div>
              )}
        </div>div>
      )
}

function badgeStyle(color: string): React.CSSProperties {
    return {
          display: 'inline-block',
          background: `${color}20`,
          border: `1px solid ${color}50`,
          borderRadius: 100,
          padding: '2px 10px',
          fontSize: 11,
          fontWeight: 700,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
    }
}

// -- Main KontoPage
export default function KontoPage() {
    const router = useRouter()
        const [loading, setLoading] = useState(true)
            const [user, setUser] = useState<{ email: string; id: string } | null>(null)
                const [vouchers, setVouchers] = useState<VoucherRow[]>([])
                    const [orders, setOrders] = useState<OrderRow[]>([])
                        const [activeTab, setActiveTab] = useState<'vouchers' | 'orders'>('vouchers')
                          
                            const loadData = useCallback(async () => {
                                  const supabase = createClient()
                                        const { data: { session } } = await supabase.auth.getSession()
                                          
                                              if (!session) {
                                                      router.push('/logga-in?redirect=/konto')
                                                              return
                                              }
                              
                                  setUser({ email: session.user.email ?? '', id: session.user.id })
                                    
                                        // Load vouchers with deal info
                                  const { data: voucherData } = await supabase
                                          .from('vouchers')
                                          .select(`
                                                  id, code, status, used_at, created_at, expires_at,
                                                          deal:deals(title, merchant_name, price, original_price, image_url)
                                                                `)
                                          .eq('user_id', session.user.id)
                                          .order('created_at', { ascending: false })
                                    
                                        if (voucherData) {
                                                setVouchers(voucherData as VoucherRow[])
                                        }
                              
                                  // Load orders
                                  const { data: orderData } = await supabase
                                          .from('orders')
                                          .select('id, amount, status, created_at')
                                          .eq('user_id', session.user.id)
                                          .order('created_at', { ascending: false })
                                    
                                        if (orderData) {
                                                setOrders(orderData as OrderRow[])
                                        }
                              
                                  setLoading(false)
                            }, [router])
                              
                                useEffect(() => {
                                      loadData()
                                }, [loadData])
                                  
                                    async function handleLogout() {
                                          const supabase = createClient()
                                                await supabase.auth.signOut()
                                                      router.push('/')
                                    }
  
    if (loading) {
          return (
                  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0806' }}>
                          <div style={{ color: '#C4974A', fontSize: 16 }}>Laddar ditt konto...</div>div>
                  </div>div>
                )
    }
  
    const activeVouchers = vouchers.filter(v => v.status === 'active' && (!v.expires_at || new Date(v.expires_at) > new Date()))
        const usedVouchers = vouchers.filter(v => v.status === 'used')
            const expiredVouchers = vouchers.filter(v => v.status !== 'used' && v.expires_at && new Date(v.expires_at) <= new Date())
              
                return (
                      <div style={{ minHeight: '100vh', background: '#0A0806', color: '#F5F2ED', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                        {/* Header */}
                            <div style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '32px 24px 24px', maxWidth: 700, margin: '0 auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                              <div>
                                                          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#F5F2ED', fontFamily: 'Georgia, serif' }}>
                                                                        Mitt konto
                                                          </h1>h1>
                                                          <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>{user?.email}</p>p>
                                              </div>div>
                                              <button onClick={handleLogout} style={{
                                    background: 'none',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 100,
                                    color: '#6B7280',
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                    fontSize: 13,
                      }}>
                                                          Logga ut
                                              </button>button>
                                    </div>div>
                            
                              {/* Stats row */}
                                    <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
                                              <StatCard label="Aktiva vouchers" value={activeVouchers.length} color="#10B981" />
                                              <StatCard label="Anvanda deals" value={usedVouchers.length} color="#C4974A" />
                                              <StatCard label="Totala kop" value={orders.length} color="#6B7280" />
                                    </div>div>
                            </div>div>
                      
                        {/* Tabs */}
                            <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
                                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.1)', marginTop: 24, gap: 0 }}>
                                      {(['vouchers', 'orders'] as const).map(tab => (
                                    <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    style={{
                                                                      background: 'none',
                                                                      border: 'none',
                                                                      borderBottom: `2px solid ${activeTab === tab ? '#C4974A' : 'transparent'}`,
                                                                      color: activeTab === tab ? '#C4974A' : '#6B7280',
                                                                      cursor: 'pointer',
                                                                      fontSize: 14,
                                                                      fontWeight: activeTab === tab ? 600 : 400,
                                                                      padding: '12px 20px',
                                                                      marginBottom: -1,
                                                                      transition: 'all 0.2s',
                                                    }}
                                                  >
                                      {tab === 'vouchers' ? `Mina vouchers (${vouchers.length})` : `Orderhistorik (${orders.length})`}
                                    </button>button>
                                  ))}
                                    </div>div>
                            
                              {/* Content */}
                                    <div style={{ paddingTop: 24, paddingBottom: 60 }}>
                                      {activeTab === 'vouchers' && (
                                    <>
                                      {vouchers.length === 0 ? (
                                                      <EmptyState
                                                                          title="Inga vouchers annu"
                                                                          desc="Utforska vara deals och kop din forsta voucher!"
                                                                          cta="Utforska deals"
                                                                          href="/deals"
                                                                        />
                                                    ) : (
                                                      <>
                                                        {activeVouchers.length > 0 && (
                                                                            <section style={{ marginBottom: 32 }}>
                                                                                                  <SectionLabel>Aktiva ({activeVouchers.length})</SectionLabel>SectionLabel>
                                                                              {activeVouchers.map(v => <VoucherCard key={v.id} voucher={v} />)}
                                                                            </section>section>
                                                                        )}
                                                        {usedVouchers.length > 0 && (
                                                                            <section style={{ marginBottom: 32 }}>
                                                                                                  <SectionLabel>Anvanda ({usedVouchers.length})</SectionLabel>SectionLabel>
                                                                              {usedVouchers.map(v => <VoucherCard key={v.id} voucher={v} />)}
                                                                            </section>section>
                                                                        )}
                                                        {expiredVouchers.length > 0 && (
                                                                            <section>
                                                                                                  <SectionLabel>Utgangna ({expiredVouchers.length})</SectionLabel>SectionLabel>
                                                                              {expiredVouchers.map(v => <VoucherCard key={v.id} voucher={v} />)}
                                                                            </section>section>
                                                                        )}
                                                      </>>
                                                    )}
                                    </>>
                                  )}
                                    
                                      {activeTab === 'orders' && (
                                    <>
                                      {orders.length === 0 ? (
                                                      <EmptyState
                                                                          title="Inga kop annu"
                                                                          desc="Du har inte gjort nagra kop an."
                                                                          cta="Utforska deals"
                                                                          href="/deals"
                                                                        />
                                                    ) : (
                                                      <div>
                                                        {orders.map(order => (
                                                                            <div key={order.id} style={{
                                                                                                    background: 'rgba(255,255,255,0.03)',
                                                                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                                                                    borderRadius: 12,
                                                                                                    padding: '16px 20px',
                                                                                                    marginBottom: 12,
                                                                                                    display: 'flex',
                                                                                                    justifyContent: 'space-between',
                                                                                                    alignItems: 'center',
                                                                                                    flexWrap: 'wrap',
                                                                                                    gap: 8,
                                                                            }}>
                                                                                                  <div>
                                                                                                                          <div style={{ color: '#F5F2ED', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                                                                                                                                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                                                                                                            </div>div>
                                                                                                                          <div style={{ color: '#6B7280', fontSize: 12 }}>
                                                                                                                            {new Date(order.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                                                                            </div>div>
                                                                                                    </div>div>
                                                                                                  <div style={{ textAlign: 'right' }}>
                                                                                                                          <div style={{ color: '#C4974A', fontSize: 16, fontWeight: 700 }}>{order.amount} kr</div>div>
                                                                                                                          <span style={badgeStyle(order.status === 'completed' ? '#10B981' : order.status === 'pending' ? '#F59E0B' : '#6B7280')}>
                                                                                                                            {order.status === 'completed' ? 'Genomford' : order.status === 'pending' ? 'Behandlas' : order.status}
                                                                                                                            </span>span>
                                                                                                    </div>div>
                                                                            </div>div>
                                                                          ))}
                                                      </div>div>
                                                  )}
                                    </>>
                                  )}
                                    </div>div>
                            </div>div>
                      </div>div>
                    )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
          <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: '14px 20px',
                  flex: '1 1 120px',
                  minWidth: 100,
          }}>
                <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{label}</div>div>
          </div>div>
        )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
          <h2 style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 12px',
          }}>{children}</h2>h2>
        )
}

function EmptyState({ title, desc, cta, href }: { title: string; desc: string; cta: string; href: string }) {
    return (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>div>
                <h3 style={{ color: '#F5F2ED', margin: '0 0 8px', fontSize: 18 }}>{title}</h3>h3>
                <p style={{ color: '#6B7280', margin: '0 0 24px', fontSize: 14 }}>{desc}</p>p>
                <Link href={href} style={{
                    color: '#0A0806',
                    backgroundColor: '#C4974A',
                    borderRadius: 100,
                    padding: '12px 28px',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 600,
          }}>{cta}</Link>Link>
          </div>div>
        )
}</></></></button>
