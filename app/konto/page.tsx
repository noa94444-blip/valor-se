'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const LG = '#E8E4DE'

export default function KontoPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [vouchers, setVouchers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'vouchers' | 'orders' | 'settings'>('vouchers')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/logga-in')
      return
    }
    setUser(user)

    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    setProfile(profileData)

    // Get vouchers
    const { data: voucherData } = await supabase
      .from('vouchers')
      .select('*, deals(title, image_url, deal_price, merchants(name, address, city))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setVouchers(voucherData || [])

    // Get orders
    const { data: orderData } = await supabase
      .from('orders')
      .select('*, deals(title, deal_price, image_url, merchants(name))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(orderData || [])

    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: IV, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', color: GR }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⟳</div>
          <p>Laddar ditt konto...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: IV, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: G, padding: '40px 24px 30px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: AU, textTransform: 'uppercase', marginBottom: 8 }}>Mitt konto</div>
            <h1 style={{ fontSize: 32, fontFamily: 'Georgia, serif', color: WH, fontWeight: 400, margin: 0 }}>
              {profile?.full_name || user?.email?.split('@')[0] || 'Välkommen'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '8px 0 0' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: WH, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            Logga ut
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 24px', display: 'flex', gap: 40 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: G }}>{vouchers.length}</div>
            <div style={{ fontSize: 12, color: GR }}>Vouchers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: G }}>{orders.length}</div>
            <div style={{ fontSize: 12, color: GR }}>Beställningar</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: G }}>
              {orders.reduce((sum, o) => sum + (o.total_price || 0), 0)} kr
            </div>
            <div style={{ fontSize: 12, color: GR }}>Totalt sparat</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
          {([['vouchers', 'Mina Vouchers'], ['orders', 'Beställningar'], ['settings', 'Inställningar']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '16px 24px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: activeTab === tab ? G : GR, borderBottom: activeTab === tab ? `2px solid ${G}` : '2px solid transparent', fontFamily: 'Inter, sans-serif', fontWeight: activeTab === tab ? 600 : 400 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Vouchers Tab */}
        {activeTab === 'vouchers' && (
          <div>
            {vouchers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: GR }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
                <p style={{ margin: 0 }}>Inga vouchers än. <a href="/deals" style={{ color: G }}>Hitta deals →</a></p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {vouchers.map(v => (
                  <div key={v.id} style={{ backgroundColor: WH, borderRadius: 12, padding: 24, border: `1px solid ${LG}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, color: AU, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{v.deals?.merchants?.name}</div>
                      <div style={{ fontSize: 16, color: G, fontFamily: 'Georgia, serif', marginBottom: 8 }}>{v.deals?.title}</div>
                      <div style={{ fontSize: 13, color: GR }}>📍 {v.deals?.merchants?.address}, {v.deals?.merchants?.city}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, color: G, fontFamily: 'monospace', marginBottom: 6 }}>{v.code}</div>
                      <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        backgroundColor: v.status === 'active' ? '#ECFDF5' : v.status === 'used' ? '#F3F4F6' : '#FEF2F2',
                        color: v.status === 'active' ? '#059669' : v.status === 'used' ? GR : '#DC2626' }}>
                        {v.status === 'active' ? '✓ Aktiv' : v.status === 'used' ? '✗ Använd' : '⚠ Utgången'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: GR }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <p style={{ margin: 0 }}>Inga beställningar än.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ backgroundColor: WH, borderRadius: 12, padding: 20, border: `1px solid ${LG}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 15, color: G, fontFamily: 'Georgia, serif', marginBottom: 4 }}>{o.deals?.title}</div>
                      <div style={{ fontSize: 13, color: GR }}>
                        {new Date(o.created_at).toLocaleDateString('sv-SE')} · Antal: {o.quantity}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: G }}>{o.total_price} kr</div>
                      <div style={{ fontSize: 11, color: o.status === 'paid' ? '#059669' : GR, marginTop: 4 }}>
                        {o.status === 'paid' ? '✓ Betald' : o.status === 'pending' ? '⏳ Väntar' : '✗ Avbruten'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: WH, borderRadius: 12, padding: 32, border: `1px solid ${LG}`, maxWidth: 500 }}>
            <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 24px' }}>Kontoinställningar</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: G, marginBottom: 6, fontWeight: 500 }}>Namn</label>
              <input type="text" defaultValue={profile?.full_name || ''}
                style={{ width: '100%', padding: '12px 16px', border: `1px solid ${LG}`, borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: G, marginBottom: 6, fontWeight: 500 }}>E-post</label>
              <input type="email" defaultValue={user?.email || ''} disabled
                style={{ width: '100%', padding: '12px 16px', border: `1px solid ${LG}`, borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', backgroundColor: IV, boxSizing: 'border-box' }} />
            </div>
            <button style={{ padding: '12px 24px', backgroundColor: G, color: AU, border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Spara ändringar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
