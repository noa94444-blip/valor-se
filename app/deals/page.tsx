'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const LG = '#E8E4DE'

type Deal = {
  id: string
  title: string
  slug: string
  description: string
  original_price: number
  deal_price: number
  image_url?: string | null
  category: string
  city?: string
  valid_until: string | null
  status: string
  sold_count: number
  merchants?: {
    name: string
    address: string | null
    city: string
    logo_url?: string | null
  }
}

const CATEGORIES = ['Alla kategorier', 'Skonhet', 'Mat och Dryck', 'Halsa', 'Fordon', 'Upplevelser', 'Shopping']
const CITIES = ['Alla städer', 'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås']

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Alla kategorier')
  const [selectedCity, setSelectedCity] = useState('Alla städer')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchDeals()
  }, [])

  async function fetchDeals() {
    setLoading(true)
    const { data, error } = await supabase
      .from('deals')
      .select('*, merchants(name, address, city, logo_url, slug)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching deals:', error)
    } else {
      setDeals(data || [])
    }
    setLoading(false)
  }

  const filtered = deals
    .filter(d => {
      const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || (d.merchants?.name || '').toLowerCase().includes(search.toLowerCase())
      const matchCat = selectedCategory === 'Alla kategorier' || d.category === selectedCategory
      const matchCity = selectedCity === 'Alla städer' || (d.merchants?.city || '').includes(selectedCity) || (d.city || '').includes(selectedCity)
      return matchSearch && matchCat && matchCity
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.deal_price - b.deal_price
      if (sortBy === 'price_desc') return b.deal_price - a.deal_price
      if (sortBy === 'discount') return (b.original_price - b.deal_price) - (a.original_price - a.deal_price)
      return 0
    })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: IV, fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div style={{ backgroundColor: G, padding: '60px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: AU, textTransform: 'uppercase', marginBottom: 12 }}>Exklusiva erbjudanden</div>
        <h1 style={{ fontSize: 42, fontFamily: 'Georgia, serif', color: WH, fontWeight: 400, margin: '0 0 16px' }}>Dagens deals</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, margin: '0 auto', maxWidth: 500 }}>
          Handplockade erbjudanden från Stockholms bästa restauranger, spaanläggningar och butiker
        </p>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}`, padding: '20px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Sök deals eller restauranger..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '1 1 240px', padding: '10px 16px', border: `1px solid ${LG}`, borderRadius: 6, fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif' }}
          />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '10px 16px', border: `1px solid ${LG}`, borderRadius: 6, fontSize: 14, backgroundColor: WH, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
            style={{ padding: '10px 16px', border: `1px solid ${LG}`, borderRadius: 6, fontSize: 14, backgroundColor: WH, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '10px 16px', border: `1px solid ${LG}`, borderRadius: 6, fontSize: 14, backgroundColor: WH, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            <option value="newest">Nyast</option>
            <option value="price_asc">Lägst pris</option>
            <option value="price_desc">Högst pris</option>
            <option value="discount">Högst rabatt</option>
          </select>
          <span style={{ color: GR, fontSize: 13 }}>{filtered.length} deals</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: GR }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⟳</div>
            <p>Laddar deals...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: GR }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <p>Inga deals matchar dina filter</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filtered.map(deal => {
              const discountPct = deal.original_price > 0 ? Math.round((1 - deal.deal_price / deal.original_price) * 100) : 0
              return (
                <a key={deal.id} href={`/deals/${deal.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ backgroundColor: WH, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)' }}>
                    {/* Image */}
                    <div style={{ height: 200, backgroundColor: G, position: 'relative', overflow: 'hidden' }}>
                      {deal.image_url ? (
                        <img src={deal.image_url} alt={deal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.4, color: WH }}>✦</div>
                      )}
                      {discountPct > 0 && (
                        <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: AU, color: WH, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          -{discountPct}%
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.5)', color: WH, padding: '4px 10px', borderRadius: 20, fontSize: 11 }}>
                        {deal.category}
                      </div>
                    </div>
                    {/* Content */}
                    <div style={{ padding: '20px' }}>
                      {deal.merchants && (
                        <div style={{ fontSize: 11, color: AU, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                          {deal.merchants.name}
                        </div>
                      )}
                      <h3 style={{ fontSize: 17, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 8px', lineHeight: 1.4 }}>{deal.title}</h3>
                      <p style={{ fontSize: 13, color: GR, margin: '0 0 16px', lineHeight: 1.5 }}>{deal.description?.substring(0, 80)}...</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: 22, fontWeight: 700, color: G }}>{deal.deal_price} kr</span>
                          {deal.original_price > deal.deal_price && (
                            <span style={{ fontSize: 13, color: GR, textDecoration: 'line-through', marginLeft: 8 }}>{deal.original_price} kr</span>
                          )}
                        </div>
                        <div style={{ backgroundColor: G, color: AU, padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
                          Köp nu
                        </div>
                      </div>
                      {deal.merchants && (
                        <div style={{ marginTop: 12, fontSize: 12, color: GR }}>📍 {deal.merchants.city}</div>
                      )}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
