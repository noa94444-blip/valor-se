'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('overview')
    const [orders, setOrders] = useState([])
    const [vouchers, setVouchers] = useState([])
    const [merchants, setMerchants] = useState([])
    const [deals, setDeals] = useState([])
    const [payouts, setPayouts] = useState([])
    const [transactions, setTransactions] = useState([])
    const [stats, setStats] = useState({ orders: 0, revenue: 0, merchants: 0, deals: 0 })

  useEffect(() => {
        checkAuth()
  }, [])

  async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
                router.push('/logga-in?redirect=/admin')
                return
        }
        setLoading(false)
        loadData()
  }

  async function loadData() {
        const [o, v, m, d, p, t] = await Promise.all([
                supabase.from('orders').select('*').order('created_at', { ascending: false }),
                supabase.from('vouchers').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('deals').select('*').order('created_at', { ascending: false }),
                supabase.from('payouts').select('*').order('created_at', { ascending: false }),
                supabase.from('transactions').select('*').order('created_at', { ascending: false }),
              ])
        if (o.data) setOrders(o.data)
        if (v.data) setVouchers(v.data)
        if (m.data) setMerchants(m.data)
        if (d.data) setDeals(d.data)
        if (p.data) setPayouts(p.data)
        if (t.data) setTransactions(t.data)
        setStats({
                orders: o.data?.length || 0,
                revenue: o.data?.reduce((s, x) => s + (x.amount || 0), 0) || 0,
                merchants: m.data?.length || 0,
                deals: d.data?.length || 0,
        })
  }

  async function markPayoutPaid(id) {
        await supabase.from('payouts').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id)
        loadData()
  }

  function exportCSV(data, filename) {
        if (!data || !data.length) return
        const keys = Object.keys(data[0])
        const rows = data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))
        const csv = [keys.join(','), ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
  }

  const tabs = ['overview', 'payouts', 'transactions', 'orders', 'vouchers', 'merchants', 'deals']
    const tabLabels = {
          overview: '📊 Översikt',
          payouts: '💰 Utbetalningar',
          transactions: '📋 Transaktioner',
          orders: '🛍️ Ordrar',
          vouchers: '🎫 Vouchers',
          merchants: '🏪 Merchants',
          deals: '🎯 Deals',
    }

  if (loading) {
        return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f0f', color: '#fff' }}>
                          <div>Laddar admin...</div>div>
                </div>div>
              )
  }
  
    return (
          <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'sans-serif' }}>
                <div style={{ background: '#1a1a1a', padding: '16px 32px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>VALÖR Admin</h1>h1>
                        <button onClick={() => supabase.auth.signOut().then(() => router.push('/logga-in'))} style={{ background: '#333', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Logga ut</button>button>
                </div>div>
          
                <div style={{ display: 'flex', gap: '8px', padding: '16px 32px', borderBottom: '1px solid #222', flexWrap: 'wrap' }}>
                  {tabs.map(t => (
                      <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: tab === t ? '#C4974A' : '#222', color: tab === t ? '#000' : '#fff', fontWeight: tab === t ? 700 : 400 }}>
                        {tabLabels[t]}
                      </button>button>
                    ))}
                </div>div>
          
                <div style={{ padding: '24px 32px' }}>
                
                  {tab === 'overview' && (
                      <div>
                                  <h2 style={{ marginBottom: '24px' }}>Översikt</h2>h2>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                                    {[
                        { label: 'Totala ordrar', value: stats.orders, color: '#C4974A' },
                        { label: 'Total omsättning', value: `${stats.revenue} kr`, color: '#22c55e' },
                        { label: 'Merchants', value: stats.merchants, color: '#3b82f6' },
                        { label: 'Aktiva deals', value: stats.deals, color: '#a855f7' },
                                      ].map(card => (
                                                        <div key={card.label} style={{ background: '#1a1a1a', border: `1px solid ${card.color}33`, borderRadius: '12px', padding: '20px' }}>
                                                                          <div style={{ color: '#999', fontSize: '14px', marginBottom: '8px' }}>{card.label}</div>div>
                                                                          <div style={{ color: card.color, fontSize: '28px', fontWeight: 700 }}>{card.value}</div>div>
                                                        </div>div>
                                                      ))}
                                  </div>div>
                                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
                                                <h3 style={{ margin: '0 0 16px' }}>Senaste ordrar</h3>h3>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ borderBottom: '1px solid #333' }}>
                                                                                    {['ID', 'Belopp', 'Status', 'Datum'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#999', fontWeight: 500 }}>{h}</th>th>)}
                                                                                    </tr>tr>
                                                                </thead>thead>
                                                                <tbody>
                                                                  {orders.slice(0, 5).map(o => (
                                            <tr key={o.id} style={{ borderBottom: '1px solid #222' }}>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{o.id?.slice(0, 8)}...</td>td>
                                                                  <td style={{ padding: '8px' }}>{o.amount} kr</td>td>
                                                                  <td style={{ padding: '8px' }}><span style={{ background: o.status === 'completed' ? '#22c55e22' : '#f59e0b22', color: o.status === 'completed' ? '#22c55e' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{o.status}</span>span></td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('sv') : '-'}</td>td>
                                            </tr>tr>
                                          ))}
                                                                </tbody>tbody>
                                                </table>table>
                                  </div>div>
                      </div>div>
                        )}
                
                  {tab === 'payouts' && (
                      <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <h2 style={{ margin: 0 }}>Utbetalningar</h2>h2>
                                                <button onClick={() => exportCSV(payouts, 'payouts.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>⬇️ Exportera CSV</button>button>
                                  </div>div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                                    {[
                        { label: 'Väntande', value: payouts.filter(p => p.status === 'pending').length, color: '#f59e0b' },
                        { label: 'Tillgängliga', value: payouts.filter(p => p.status === 'available').length, color: '#3b82f6' },
                        { label: 'Betalda', value: payouts.filter(p => p.status === 'paid').length, color: '#22c55e' },
                                      ].map(card => (
                                                        <div key={card.label} style={{ background: '#1a1a1a', border: `1px solid ${card.color}33`, borderRadius: '12px', padding: '20px' }}>
                                                                          <div style={{ color: '#999', fontSize: '14px' }}>{card.label}</div>div>
                                                                          <div style={{ color: card.color, fontSize: '32px', fontWeight: 700 }}>{card.value}</div>div>
                                                        </div>div>
                                                      ))}
                                  </div>div>
                                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ borderBottom: '1px solid #333' }}>
                                                                                    {['Merchant', 'Belopp', 'Provision (15%)', 'Netto (85%)', 'Status', 'Åtgärd'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#999', fontWeight: 500 }}>{h}</th>th>)}
                                                                                    </tr>tr>
                                                                </thead>thead>
                                                                <tbody>
                                                                  {payouts.map(p => (
                                            <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                                                                  <td style={{ padding: '8px' }}>{p.merchant_id?.slice(0, 8) || '-'}</td>td>
                                                                  <td style={{ padding: '8px' }}>{p.gross_amount || p.amount || 0} kr</td>td>
                                                                  <td style={{ padding: '8px', color: '#C4974A' }}>{p.commission_amount || 0} kr</td>td>
                                                                  <td style={{ padding: '8px', color: '#22c55e' }}>{p.net_amount || p.amount || 0} kr</td>td>
                                                                  <td style={{ padding: '8px' }}><span style={{ background: p.status === 'paid' ? '#22c55e22' : p.status === 'available' ? '#3b82f622' : '#f59e0b22', color: p.status === 'paid' ? '#22c55e' : p.status === 'available' ? '#3b82f6' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{p.status}</span>span></td>td>
                                                                  <td style={{ padding: '8px' }}>
                                                                    {p.status !== 'paid' && (
                                                                        <button onClick={() => markPayoutPaid(p.id)} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>✓ Markera betald</button>button>
                                                                                          )}
                                                                  </td>td>
                                            </tr>tr>
                                          ))}
                                                                  {payouts.length === 0 && (
                                            <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Inga utbetalningar ännu</td>td></tr>tr>
                                                                                  )}
                                                                </tbody>tbody>
                                                </table>table>
                                  </div>div>
                      </div>div>
                        )}
                
                  {tab === 'transactions' && (
                      <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <h2 style={{ margin: 0 }}>Transaktioner</h2>h2>
                                                <button onClick={() => exportCSV(transactions, 'transactions.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>⬇️ Exportera CSV</button>button>
                                  </div>div>
                                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ borderBottom: '1px solid #333' }}>
                                                                                    {['ID', 'Typ', 'Belopp', 'Status', 'Datum'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#999', fontWeight: 500 }}>{h}</th>th>)}
                                                                                    </tr>tr>
                                                                </thead>thead>
                                                                <tbody>
                                                                  {transactions.map(t => (
                                            <tr key={t.id} style={{ borderBottom: '1px solid #222' }}>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{t.id?.slice(0, 8)}...</td>td>
                                                                  <td style={{ padding: '8px' }}>{t.type || t.transaction_type || '-'}</td>td>
                                                                  <td style={{ padding: '8px' }}>{t.amount || 0} kr</td>td>
                                                                  <td style={{ padding: '8px' }}><span style={{ background: '#22c55e22', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{t.status || 'completed'}</span>span></td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString('sv') : '-'}</td>td>
                                            </tr>tr>
                                          ))}
                                                                  {transactions.length === 0 && (
                                            <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Inga transaktioner ännu</td>td></tr>tr>
                                                                                  )}
                                                                </tbody>tbody>
                                                </table>table>
                                  </div>div>
                      </div>div>
                        )}
                
                  {tab === 'orders' && (
                      <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <h2 style={{ margin: 0 }}>Ordrar</h2>h2>
                                                <button onClick={() => exportCSV(orders, 'orders.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>⬇️ Exportera CSV</button>button>
                                  </div>div>
                                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ borderBottom: '1px solid #333' }}>
                                                                                    {['ID', 'Belopp', 'Status', 'Datum'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#999', fontWeight: 500 }}>{h}</th>th>)}
                                                                                    </tr>tr>
                                                                </thead>thead>
                                                                <tbody>
                                                                  {orders.map(o => (
                                            <tr key={o.id} style={{ borderBottom: '1px solid #222' }}>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{o.id?.slice(0, 8)}...</td>td>
                                                                  <td style={{ padding: '8px' }}>{o.amount} kr</td>td>
                                                                  <td style={{ padding: '8px' }}><span style={{ background: o.status === 'completed' ? '#22c55e22' : '#f59e0b22', color: o.status === 'completed' ? '#22c55e' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{o.status}</span>span></td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('sv') : '-'}</td>td>
                                            </tr>tr>
                                          ))}
                                                                  {orders.length === 0 && <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Inga ordrar ännu</td>td></tr>tr>}
                                                                </tbody>tbody>
                                                </table>table>
                                  </div>div>
                      </div>div>
                        )}
                
                  {tab === 'vouchers' && (
                      <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <h2 style={{ margin: 0 }}>Vouchers</h2>h2>
                                                <button onClick={() => exportCSV(vouchers, 'vouchers.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>⬇️ Exportera CSV</button>button>
                                  </div>div>
                                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ borderBottom: '1px solid #333' }}>
                                                                                    {['Kod', 'Status', 'Deal', 'Datum'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#999', fontWeight: 500 }}>{h}</th>th>)}
                                                                                    </tr>tr>
                                                                </thead>thead>
                                                                <tbody>
                                                                  {vouchers.map(v => (
                                            <tr key={v.id} style={{ borderBottom: '1px solid #222' }}>
                                                                  <td style={{ padding: '8px', fontFamily: 'monospace' }}>{v.code || v.voucher_code || '-'}</td>td>
                                                                  <td style={{ padding: '8px' }}><span style={{ background: v.used || v.redeemed ? '#22c55e22' : '#3b82f622', color: v.used || v.redeemed ? '#22c55e' : '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{v.used || v.redeemed ? 'Använd' : 'Aktiv'}</span>span></td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{v.deal_id?.slice(0, 8) || '-'}</td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{v.created_at ? new Date(v.created_at).toLocaleDateString('sv') : '-'}</td>td>
                                            </tr>tr>
                                          ))}
                                                                  {vouchers.length === 0 && <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Inga vouchers ännu</td>td></tr>tr>}
                                                                </tbody>tbody>
                                                </table>table>
                                  </div>div>
                      </div>div>
                        )}
                
                  {tab === 'merchants' && (
                      <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <h2 style={{ margin: 0 }}>Merchants</h2>h2>
                                                <button onClick={() => exportCSV(merchants, 'merchants.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>⬇️ Exportera CSV</button>button>
                                  </div>div>
                                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ borderBottom: '1px solid #333' }}>
                                                                                    {['Namn', 'Email', 'Roll', 'Registrerad'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#999', fontWeight: 500 }}>{h}</th>th>)}
                                                                                    </tr>tr>
                                                                </thead>thead>
                                                                <tbody>
                                                                  {merchants.map(m => (
                                            <tr key={m.id} style={{ borderBottom: '1px solid #222' }}>
                                                                  <td style={{ padding: '8px' }}>{m.full_name || m.name || '-'}</td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{m.email || '-'}</td>td>
                                                                  <td style={{ padding: '8px' }}><span style={{ background: m.role === 'merchant' ? '#C4974A22' : '#33333344', color: m.role === 'merchant' ? '#C4974A' : '#999', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{m.role || 'user'}</span>span></td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{m.created_at ? new Date(m.created_at).toLocaleDateString('sv') : '-'}</td>td>
                                            </tr>tr>
                                          ))}
                                                                  {merchants.length === 0 && <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Inga merchants ännu</td>td></tr>tr>}
                                                                </tbody>tbody>
                                                </table>table>
                                  </div>div>
                      </div>div>
                        )}
                
                  {tab === 'deals' && (
                      <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <h2 style={{ margin: 0 }}>Deals</h2>h2>
                                                <button onClick={() => exportCSV(deals, 'deals.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>⬇️ Exportera CSV</button>button>
                                  </div>div>
                                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ borderBottom: '1px solid #333' }}>
                                                                                    {['Titel', 'Pris', 'Ordinarie', 'Status', 'Datum'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#999', fontWeight: 500 }}>{h}</th>th>)}
                                                                                    </tr>tr>
                                                                </thead>thead>
                                                                <tbody>
                                                                  {deals.map(d => (
                                            <tr key={d.id} style={{ borderBottom: '1px solid #222' }}>
                                                                  <td style={{ padding: '8px' }}>{d.title || d.name || '-'}</td>td>
                                                                  <td style={{ padding: '8px', color: '#C4974A' }}>{d.price || d.discounted_price || 0} kr</td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999', textDecoration: 'line-through' }}>{d.original_price || 0} kr</td>td>
                                                                  <td style={{ padding: '8px' }}><span style={{ background: d.active || d.is_active ? '#22c55e22' : '#33333344', color: d.active || d.is_active ? '#22c55e' : '#999', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{d.active || d.is_active ? 'Aktiv' : 'Inaktiv'}</span>span></td>td>
                                                                  <td style={{ padding: '8px', fontSize: '13px', color: '#999' }}>{d.created_at ? new Date(d.created_at).toLocaleDateString('sv') : '-'}</td>td>
                                            </tr>tr>
                                          ))}
                                                                  {deals.length === 0 && <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Inga deals ännu</td>td></tr>tr>}
                                                                </tbody>tbody>
                                                </table>table>
                                  </div>div>
                      </div>div>
                        )}
                
                </div>div>
          </div>div>
        )
}
