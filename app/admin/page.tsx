'use client'
import { useState } from 'react'
import Link from 'next/link'

const C = {
    forest: '#1A3A2A',
    forestDark: '#0D1F14',
    forestMid: '#2A5A3A',
    gold: '#C4974A',
    goldLight: '#E8B86D',
    ivory: '#F5F2ED',
    ivoryDark: '#EDE9E2',
    white: '#FFFFFF',
    gray: '#6B7280',
    grayLight: '#F9F8F6',
    red: '#DC2626',
    green: '#16A34A',
    orange: '#D97706',
}

const STATS = [
  { label: 'Total GMV', value: '1 284 500 kr', change: '+23%', positive: true, icon: '💰', sub: 'vs förra månaden' },
  { label: 'Aktiva deals', value: '47', change: '+8', positive: true, icon: '🏷️', sub: 'just nu live' },
  { label: 'Nya kunder', value: '2 412', change: '+41%', positive: true, icon: '👤', sub: 'senaste 30 dagar' },
  { label: 'MRR', value: '38 900 kr', change: '+18%', positive: true, icon: '📈', sub: 'månadsintäkt' },
  { label: 'Vouchers lösta', value: '1 847', change: '+12%', positive: true, icon: '🎟️', sub: 'inlösta denna månad' },
  { label: 'Aktiva merchants', value: '34', change: '+3', positive: true, icon: '🏪', sub: 'verifierade partners' },
  ]

const DEALS_DATA = [
  { id: 'd1', title: 'Massage 60 min + fotvård', merchant: 'Aura Spa & Wellness', category: 'Skönhet', price: 549, original: 1200, sold: 142, status: 'active', expires: '2026-06-15', city: 'Stockholm' },
  { id: 'd2', title: '3-rätters middag för 2', merchant: 'Restaurang Tvåkanten', category: 'Mat & Dryck', price: 699, original: 1400, sold: 89, status: 'active', expires: '2026-06-10', city: 'Göteborg' },
  { id: 'd3', title: 'Yoga retreat helg Göteborg', merchant: 'Inner Peace Studio', category: 'Hälsa', price: 1299, original: 2199, sold: 34, status: 'pending', expires: '2026-07-01', city: 'Göteborg' },
  { id: 'd4', title: 'Tesla-service komplett', merchant: 'AutoPremium Sverige', category: 'Bil', price: 1799, original: 2899, sold: 67, status: 'active', expires: '2026-05-31', city: 'Stockholm' },
  { id: 'd5', title: 'Vinprovning för två', merchant: 'Vinkällaren', category: 'Upplevelse', price: 599, original: 990, sold: 201, status: 'active', expires: '2026-06-20', city: 'Malmö' },
  { id: 'd6', title: 'Golf 18 hål + lunch', merchant: 'Barsebäck Golf & Country', category: 'Sport', price: 895, original: 1650, sold: 58, status: 'pending', expires: '2026-08-31', city: 'Malmö' },
  { id: 'd7', title: 'Padel 2h + utrustning', merchant: 'PadelCity Stockholm', category: 'Sport', price: 395, original: 720, sold: 312, status: 'active', expires: '2026-06-30', city: 'Stockholm' },
  { id: 'd8', title: 'Hotellnatt + frukost', merchant: 'Clarion Hotel Post', category: 'Resa', price: 1195, original: 2100, sold: 76, status: 'active', expires: '2026-09-01', city: 'Göteborg' },
  ]

const MERCHANTS_DATA = [
  { id: 'm1', name: 'Aura Spa & Wellness', city: 'Stockholm', category: 'Skönhet', revenue: '78 450 kr', deals: 3, status: 'active', joined: '2026-01-12', rating: 4.9 },
  { id: 'm2', name: 'Restaurang Tvåkanten', city: 'Göteborg', category: 'Mat & Dryck', revenue: '62 310 kr', deals: 2, status: 'active', joined: '2026-02-03', rating: 4.7 },
  { id: 'm3', name: 'Inner Peace Studio', city: 'Göteborg', category: 'Hälsa', revenue: '44 130 kr', deals: 4, status: 'active', joined: '2026-01-28', rating: 4.8 },
  { id: 'm4', name: 'AutoPremium Sverige', city: 'Stockholm', category: 'Bil', revenue: '120 665 kr', deals: 1, status: 'active', joined: '2025-12-15', rating: 4.6 },
  { id: 'm5', name: 'Vinkällaren', city: 'Malmö', category: 'Upplevelse', revenue: '118 999 kr', deals: 2, status: 'active', joined: '2026-01-05', rating: 4.9 },
  { id: 'm6', name: 'Barsebäck Golf & Country', city: 'Malmö', category: 'Sport', revenue: '51 960 kr', deals: 1, status: 'pending', joined: '2026-03-20', rating: 4.5 },
  ]

const ORDERS_DATA = [
  { id: '#V-8821', customer: 'Emma Lindqvist', deal: 'Massage 60 min + fotvård', merchant: 'Aura Spa', amount: '549 kr', date: '2026-05-23 14:32', status: 'redeemed' },
  { id: '#V-8820', customer: 'Marcus Björk', deal: '3-rätters middag för 2', merchant: 'Restaurang Tvåkanten', amount: '699 kr', date: '2026-05-23 13:18', status: 'active' },
  { id: '#V-8819', customer: 'Sofia Andersson', deal: 'Padel 2h + utrustning', merchant: 'PadelCity Stockholm', amount: '395 kr', date: '2026-05-23 12:55', status: 'active' },
  { id: '#V-8818', customer: 'Johan Ek', deal: 'Vinprovning för två', merchant: 'Vinkällaren', amount: '599 kr', date: '2026-05-23 11:40', status: 'active' },
  { id: '#V-8817', customer: 'Lena Svensson', deal: 'Tesla-service komplett', merchant: 'AutoPremium Sverige', amount: '1 799 kr', date: '2026-05-23 10:22', status: 'redeemed' },
  { id: '#V-8816', customer: 'Anders Nilsson', deal: 'Hotellnatt + frukost', merchant: 'Clarion Hotel Post', amount: '1 195 kr', date: '2026-05-22 19:47', status: 'active' },
  { id: '#V-8815', customer: 'Karin Magnusson', deal: 'Massage 60 min + fotvård', merchant: 'Aura Spa', amount: '549 kr', date: '2026-05-22 18:30', status: 'refunded' },
  { id: '#V-8814', customer: 'Erik Johansson', deal: 'Golf 18 hål + lunch', merchant: 'Barsebäck Golf', amount: '895 kr', date: '2026-05-22 16:15', status: 'active' },
  ]

const ACTIVITY = [
  { time: '14:32', type: 'voucher', text: 'Voucher inlöst', detail: 'Massage 60 min · Aura Spa', color: C.green },
  { time: '13:18', type: 'order', text: 'Ny order', detail: '3-rätters middag · #V-8820', color: C.gold },
  { time: '12:05', type: 'merchant', text: 'Ny merchant', detail: 'Inner Peace Studio registrerades', color: C.forest },
  { time: '11:47', type: 'order', text: 'Ny order', detail: 'Padel 2h · #V-8819', color: C.gold },
  { time: '10:22', type: 'voucher', text: 'Voucher inlöst', detail: 'Tesla-service · AutoPremium', color: C.green },
  { time: '09:15', type: 'deal', text: 'Deal godkänd', detail: 'Vinprovning för två · Vinkällaren', color: C.forestMid },
  { time: '08:30', type: 'user', text: 'Ny användare', detail: 'emma.lindqvist@gmail.com', color: C.gray },
  ]

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [deals, setDeals] = useState(DEALS_DATA)
    const [searchDeals, setSearchDeals] = useState('')
    const [searchMerchants, setSearchMerchants] = useState('')

  function approveDeal(id: string) {
        setDeals(prev => prev.map(d => d.id === id ? { ...d, status: 'active' } : d))
  }
    function rejectDeal(id: string) {
          setDeals(prev => prev.filter(d => d.id !== id))
    }

  const pendingDeals = deals.filter(d => d.status === 'pending')
    const filteredDeals = deals.filter(d => d.title.toLowerCase().includes(searchDeals.toLowerCase()) || d.merchant.toLowerCase().includes(searchDeals.toLowerCase()))
    const filteredMerchants = MERCHANTS_DATA.filter(m => m.name.toLowerCase().includes(searchMerchants.toLowerCase()))

  const tabs = [
    { id: 'overview', label: 'Översikt', icon: '📊' },
    { id: 'deals', label: `Deals${pendingDeals.length > 0 ? ` (${pendingDeals.length} väntar)` : ''}`, icon: '🏷️' },
    { id: 'merchants', label: 'Merchants', icon: '🏪' },
    { id: 'orders', label: 'Ordrar', icon: '📋' },
      ]

  const statusBadge = (status: string) => {
        const map: Record<string, { bg: string, color: string, label: string }> = {
                active: { bg: '#D1FAE5', color: C.green, label: 'Aktiv' },
                pending: { bg: '#FEF3C7', color: C.orange, label: 'Väntar' },
                redeemed: { bg: '#E0E7FF', color: '#4F46E5', label: 'Inlöst' },
                refunded: { bg: '#FEE2E2', color: C.red, label: 'Återbet.' },
        }
        const s = map[status] || map['active']
        return (
                <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' as const }}>
                  {s.label}
                </span>
              )
  }

  return (
        <div style={{ minHeight: '100vh', background: C.grayLight, fontFamily: 'Inter, system-ui, sans-serif' }}>
          {/* Top navbar */}
                <nav style={{ background: C.forestDark, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                      <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: C.gold, letterSpacing: 1 }}>VALÖR</span>
                                      <span style={{ background: C.red, color: C.white, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 0.5 }}>ADMIN</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            {pendingDeals.length > 0 && (
                      <span style={{ background: C.orange, color: C.white, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                                      ⚠️ {pendingDeals.length} deal{pendingDeals.length > 1 ? 's' : ''} väntar godkännande
                      </span>
                    )}
                                      <Link href="/" style={{ color: C.gold, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>← Tillbaka till sajten</Link>Link>
                                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.forest, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontSize: 14, fontWeight: 700 }}>N</div>
                          </div>
                </nav>

                <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px' }}>
                  {/* Page header */}
                          <div style={{ marginBottom: 28 }}>
                                      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: C.forestDark, margin: 0 }}>Plattformsöversikt</h1>h1>
                                      <p style={{ color: C.gray, fontSize: 14, margin: '6px 0 0' }}>Admin • noa · Fredag 23 maj 2026</p>
                          </div>

                  {/* Tabs */}
                          <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: C.white, borderRadius: 12, padding: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflowX: 'auto' as const }}>
                            {tabs.map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                      padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' as const,
                                      background: activeTab === tab.id ? C.forest : 'transparent',
                                      color: activeTab === tab.id ? C.white : C.gray,
                                      transition: 'all 0.2s',
                      }}>
                        {tab.icon} {tab.label}
                      </button>
                    ))}

                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <div>
                      {/* Stats grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
                                  {STATS.map(stat => (
                                      <div key={stat.label} style={{ background: C.white, borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.ivoryDark}`, transition: 'transform 0.2s' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                                                            <span style={{ fontSize: 28 }}>{stat.icon}</span>
                                                                            <span style={{ background: stat.positive ? '#D1FAE5' : '#FEE2E2', color: stat.positive ? C.green : C.red, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{stat.change}</span>
                                                        </div>
                                                        <div style={{ fontSize: 24, fontWeight: 800, color: C.forestDark, fontFamily: 'Georgia, serif', marginBottom: 4 }}>{stat.value}
                                                        <div style={{ fontSize: 13, fontWeight: 600, color: C.gray, marginBottom: 2 }}>{stat.label}
                                                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{stat.sub}
                                    ))}
                    
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                                  {/* Pending deals */}
                                              <div style={{ background: C.white, borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.ivoryDark}` }}>
                                                              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: C.forestDark, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                                                Deals för godkännande
                                                                {pendingDeals.length > 0 && <span style={{ background: C.orange, color: C.white, fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{pendingDeals.length}</span>}
                                                              </h2>h2>
                                                {pendingDeals.length === 0 ? (
                                        <div style={{ textAlign: 'center' as const, padding: '40px 20px', color: C.gray }}>
                                                            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                                                            <p style={{ margin: 0 }}>Alla deals är godkända!</p>
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                                          {pendingDeals.map(deal => (
                                                                <div key={deal.id} style={{ border: `1px solid ${C.ivoryDark}`, borderRadius: 12, padding: 16, background: C.grayLight }}>
                                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                                                                                                  <div>
                                                                                                                                              <div style={{ fontWeight: 700, color: C.forestDark, fontSize: 15, marginBottom: 4 }}>{deal.title}
                                                                                                                                              <div style={{ fontSize: 13, color: C.gray }}>{deal.merchant} · {deal.city}
                                                                                                                  <div style={{ textAlign: 'right' as const }}>
                                                                                                                                              <div style={{ fontWeight: 800, color: C.forest, fontSize: 16 }}>{(deal.price || 0).toLocaleString('sv-SE')} kr</div>
                                                                                                                                              <div style={{ fontSize: 12, color: C.gray, textDecoration: 'line-through' }}>{(deal.original || 0).toLocaleString('sv-SE')} kr</div>
                                                                                                                    </div>
                                                                                          </div>
                                                                                        <div style={{ display: 'flex', gap: 8 }}>
                                                                                                                  <button onClick={() => approveDeal(deal.id)} style={{ flex: 1, padding: '8px 16px', background: C.forest, color: C.white, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>✓ Godkänn</button>
                                                                                                                  <button onClick={() => rejectDeal(deal.id)} style={{ flex: 1, padding: '8px 16px', background: '#FEE2E2', color: C.red, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>✕ Avvisa</button>
                                                                                          </div>
                                                                </div>
                                                              ))}
                                                              )}
                                
                                  {/* Activity feed */}
                                              <div style={{ background: C.white, borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.ivoryDark}` }}>
                                                              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: C.forestDark, margin: '0 0 20px' }}>Senaste aktivitet</h2>h2>
                                                              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                                                                {ACTIVITY.map((a, i) => (
                                          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 6, flexShrink: 0 }}></div>
                                                                <div style={{ flex: 1 }}>
                                                                                        <div style={{ fontSize: 13, fontWeight: 600, color: C.forestDark }}>{a.text}
                                                                                        <div style={{ fontSize: 12, color: C.gray }}>{a.detail}
                                                                <div style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' as const }}>{a.time}
                                        ))}
                                </div>
                    </div>
                        )}
                
                  {/* DEALS TAB */}
                  {activeTab === 'deals' && (
                    <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 }}>
                                              <input
                                                                placeholder="🔍 Sök på deal eller merchant..."
                                                                value={searchDeals}
                                                                onChange={e => setSearchDeals(e.target.value)}
                                                                style={{ padding: '10px 16px', borderRadius: 10, border: `1px solid ${C.ivoryDark}`, fontSize: 14, width: 300, outline: 'none', background: C.white }}
                                                              />
                                              <div style={{ display: 'flex', gap: 8, fontSize: 13, color: C.gray }}>
                                                              <span style={{ background: '#D1FAE5', color: C.green, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>● {deals.filter(d => d.status === 'active').length} aktiva</span>
                                                              <span style={{ background: '#FEF3C7', color: C.orange, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>● {deals.filter(d => d.status === 'pending').length} väntar</span>
                                              </div>
                                </div>
                                <div style={{ background: C.white, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.ivoryDark}`, overflow: 'hidden' }}>
                                              <div style={{ overflowX: 'auto' as const }}>
                                                              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                                                                                <thead>
                                                                                                    <tr style={{ background: C.grayLight, borderBottom: `2px solid ${C.ivoryDark}` }}>
                                                                                                      {['Deal', 'Merchant', 'Stad', 'Pris', 'Sålda', 'Utgår', 'Status', 'Åtgärd'].map(h => (
                                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: C.gray, whiteSpace: 'nowrap' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{h}</th>
                                            ))}
                                                                                                      </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                  {filteredDeals.map((deal, i) => (
                                            <tr key={deal.id} style={{ borderBottom: `1px solid ${C.ivoryDark}`, background: i % 2 === 0 ? C.white : C.grayLight }}>
                                                                    <td style={{ padding: '14px 16px' }}>
                                                                                              <div style={{ fontWeight: 600, color: C.forestDark, fontSize: 14, maxWidth: 200 }}>{deal.title}
                                                                                              <div style={{ fontSize: 12, color: C.gray }}>{deal.category}
                                                                    </td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray, whiteSpace: 'nowrap' as const }}>{deal.merchant}</td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray }}>{deal.city}</td>
                                                                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' as const }}>
                                                                                              <div style={{ fontWeight: 700, color: C.forest, fontSize: 14 }}>{(deal.price || 0).toLocaleString('sv-SE')} kr</div>
                                                                                              <div style={{ fontSize: 11, color: C.gray, textDecoration: 'line-through' }}>{(deal.original || 0).toLocaleString('sv-SE')} kr</div>
                                                                    </td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: C.forestDark }}>{deal.sold}</td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 12, color: C.gray, whiteSpace: 'nowrap' as const }}>{deal.expires}</td>
                                                                    <td style={{ padding: '14px 16px' }}>{statusBadge(deal.status)}</td>
                                                                    <td style={{ padding: '14px 16px' }}>
                                                                      {deal.status === 'pending' ? (
                                                                          <div style={{ display: 'flex', gap: 6 }}>
                                                                                                        <button onClick={() => approveDeal(deal.id)} style={{ padding: '5px 12px', background: C.forest, color: C.white, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Godkänn</button>
                                                                                                        <button onClick={() => rejectDeal(deal.id)} style={{ padding: '5px 12px', background: '#FEE2E2', color: C.red, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Avvisa</button>
                                                                            </div>
                                                                        ) : (
                                                                          <button style={{ padding: '5px 12px', background: C.ivoryDark, color: C.gray, border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Redigera</button>
                                                                                              )}
                                                                    </td>
                                            </tr>
                                          ))}
                                                                                </tbody>
                                                              </table>
                                              </div>
                                </div>
                    </div>
                        )}
                
                  {/* MERCHANTS TAB */}
                  {activeTab === 'merchants' && (
                    <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 }}>
                                              <input
                                                                placeholder="🔍 Sök merchant..."
                                                                value={searchMerchants}
                                                                onChange={e => setSearchMerchants(e.target.value)}
                                                                style={{ padding: '10px 16px', borderRadius: 10, border: `1px solid ${C.ivoryDark}`, fontSize: 14, width: 280, outline: 'none', background: C.white }}
                                                              />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                                  {filteredMerchants.map(m => (
                                      <div key={m.id} style={{ background: C.white, borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.ivoryDark}` }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                                                            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${C.forest}, ${C.forestMid})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontSize: 20, fontWeight: 700 }}>
                                                                              {m.name.charAt(0)}
                                                          {statusBadge(m.status)}
                                                        <div style={{ fontWeight: 700, color: C.forestDark, fontSize: 16, marginBottom: 4 }}>{m.name}
                                                        <div style={{ fontSize: 13, color: C.gray, marginBottom: 16 }}>{m.city} · {m.category}
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                                                                            <div style={{ textAlign: 'center' as const, background: C.grayLight, borderRadius: 10, padding: '10px 8px' }}>
                                                                                                  <div style={{ fontSize: 14, fontWeight: 800, color: C.forest }}>{m.deals}
                                                                                                  <div style={{ fontSize: 10, color: C.gray, fontWeight: 600 }}>DEALS</div>
                                                                            </div>
                                                                            <div style={{ textAlign: 'center' as const, background: C.grayLight, borderRadius: 10, padding: '10px 8px' }}>
                                                                                                  <div style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>{m.rating}
                                                                                                  <div style={{ fontSize: 10, color: C.gray, fontWeight: 600 }}>BETYG</div>
                                                                            </div>
                                                                            <div style={{ textAlign: 'center' as const, background: C.grayLight, borderRadius: 10, padding: '10px 8px' }}>
                                                                                                  <div style={{ fontSize: 11, fontWeight: 800, color: C.forestDark }}>{m.revenue.split(' ')[0]}
                                                                                                  <div style={{ fontSize: 10, color: C.gray, fontWeight: 600 }}>INTÄKT</div>
                                                                            </div>
                                                        </div>
                                                        <div style={{ fontSize: 11, color: C.gray, marginBottom: 14 }}>Ansluten: {m.joined}
                                                        <button style={{ width: '100%', padding: '9px', background: C.forestDark, color: C.white, border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Visa profil →</button>
                                      </div>
                                    ))}
                        )}
                
                  {/* ORDERS TAB */}
                  {activeTab === 'orders' && (
                    <div>
                                <div style={{ background: C.white, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.ivoryDark}`, overflow: 'hidden' }}>
                                              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.ivoryDark}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                              <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 18, color: C.forestDark }}>Senaste ordrar</h2>h2>
                                                              <span style={{ fontSize: 13, color: C.gray }}>Totalt {ORDERS_DATA.length} ordrar visas</span>
                                              </div>
                                              <div style={{ overflowX: 'auto' as const }}>
                                                              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                                                                                <thead>
                                                                                                    <tr style={{ background: C.grayLight, borderBottom: `2px solid ${C.ivoryDark}` }}>
                                                                                                      {['Order-ID', 'Kund', 'Deal', 'Merchant', 'Belopp', 'Datum', 'Status'].map(h => (
                                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: C.gray, whiteSpace: 'nowrap' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{h}</th>
                                            ))}
                                                                                                      </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                  {ORDERS_DATA.map((order, i) => (
                                            <tr key={order.id} style={{ borderBottom: `1px solid ${C.ivoryDark}`, background: i % 2 === 0 ? C.white : C.grayLight }}>
                                                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: C.forest, fontSize: 13, whiteSpace: 'nowrap' as const }}>{order.id}</td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: C.forestDark, whiteSpace: 'nowrap' as const }}>{order.customer}</td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray, maxWidth: 200 }}>{order.deal}</td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray, whiteSpace: 'nowrap' as const }}>{order.merchant}</td>
                                                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: C.forestDark, fontSize: 14, whiteSpace: 'nowrap' as const }}>{order.amount}</td>
                                                                    <td style={{ padding: '14px 16px', fontSize: 12, color: C.gray, whiteSpace: 'nowrap' as const }}>{order.date}</td>
                                                                    <td style={{ padding: '14px 16px' }}>{statusBadge(order.status)}</td>
                                            </tr>
                                          ))}
                                                                                </tbody>
                                                              </table>
                                              </div>
                                </div>
                    </div>
                        )}
      )
}
