'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'

const DEALS = [
  { id: 'massage-fotvard', title: 'Massage 60 min + fotvard', merchant: 'Aura Spa & Wellness', city: 'Stockholm', category: 'Skonhet', price: 549, original: 1099, discount: 50, rating: 4.9, reviews: 142, color: '#2D5A3D', featured: true },
  { id: 'middag-tvakanten', title: '3-ratters middag for tva', merchant: 'Restaurang Tvakanten', city: 'Goteborg', category: 'Mat & Dryck', price: 699, original: 1398, discount: 50, rating: 4.7, reviews: 89, color: '#3D4A2D', featured: false },
  { id: 'yoga-retreat', title: 'Yoga retreat helg', merchant: 'Inner Peace Studio', city: 'Goteborg', category: 'Halsa', price: 1299, original: 2199, discount: 41, rating: 4.8, reviews: 34, color: '#2D3A4A', featured: true },
  { id: 'tesla-service', title: 'Tesla-service komplett', merchant: 'AutoPremium Sverige', city: 'Stockholm', category: 'Bil & Service', price: 1799, original: 2899, discount: 38, rating: 4.6, reviews: 67, color: '#3A2D1A', featured: false },
  { id: 'vinprovning', title: 'Vinprovning for 2', merchant: 'Vinkallaren', city: 'Malmo', category: 'Mat & Dryck', price: 599, original: 1099, discount: 45, rating: 4.9, reviews: 201, color: '#4A2D3A', featured: false },
  { id: 'golf-lunch', title: 'Golf 18 hal + lunch', merchant: 'Barseback Golf', city: 'Malmo', category: 'Sport', price: 895, original: 1650, discount: 46, rating: 4.5, reviews: 58, color: '#2D4A2D', featured: true },
  { id: 'padel', title: 'Padel 2h + utrustning', merchant: 'PadelCity Stockholm', city: 'Stockholm', category: 'Sport', price: 395, original: 799, discount: 51, rating: 4.8, reviews: 312, color: '#1A2D4A', featured: false },
  { id: 'hotell-frukost', title: 'Hotellnatt + frukost', merchant: 'Clarion Hotel Post', city: 'Goteborg', category: 'Resa & Boende', price: 1195, original: 2100, discount: 43, rating: 4.7, reviews: 76, color: '#2D1A3A', featured: false },
]

const CATS = ['Alla', 'Skonhet', 'Mat & Dryck', 'Sport', 'Halsa', 'Upplevelse', 'Resa & Boende', 'Bil & Service']
const CITIES = ['Alla stader', 'Stockholm', 'Goteborg', 'Malmo']

export default function DealsPage() {
  const [cat, setCat] = useState('Alla')
  const [city, setCity] = useState('Alla stader')
  const [sort, setSort] = useState('featured')

  const filtered = DEALS
    .filter(d => (cat === 'Alla' || d.category === cat) && (city === 'Alla stader' || d.city === city))
    .sort((a, b) => {
      if (sort === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'discount') return b.discount - a.discount
      return 0
    })

  function btnS(active) {
    return { padding: '8px 18px', borderRadius: 999, border: active ? 'none' : '1px solid #ddd', background: active ? G : WH, color: active ? WH : '#444', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: active ? 600 : 400 }
  }

  return (
    <div style={{ background: IV, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ background: WH, borderBottom: '1px solid #E8E4DF', position: 'sticky', top: 0, zIndex: 50, padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: G, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AU, fontWeight: 700, fontSize: 16 }}>V</div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: G }}>Valor</span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href='/logga-in' style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ddd', background: WH, color: '#333', textDecoration: 'none', fontSize: 14 }}>Logga in</Link>
            <Link href='/registrera' style={{ padding: '10px 20px', borderRadius: 8, background: G, color: WH, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Bli medlem</Link>
          </div>
        </div>
      </nav>
      <div style={{ background: G, padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: AU, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>KURERADE ERBJUDANDEN</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,52px)', color: WH, margin: '0 0 12px', lineHeight: 1.1 }}>Utforska deals</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, margin: 0 }}>{filtered.length} erbjudanden hittades</p>
        </div>
      </div>
      <div style={{ background: WH, borderBottom: '1px solid #E8E4DF', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {CITIES.map(c => (<button key={c} onClick={() => setCity(c)} style={btnS(city === c)}>{c}</button>))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATS.map(c => (<button key={c} onClick={() => setCat(c)} style={btnS(cat === c)}>{c}</button>))}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', background: WH, fontFamily: 'Inter, sans-serif', fontSize: 14, cursor: 'pointer', color: '#333' }}>
              <option value='featured'>Rekommenderade</option>
              <option value='price-low'>Pris: Lagst forst</option>
              <option value='price-high'>Pris: Hogst forst</option>
              <option value='discount'>Storsta rabatt</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: GR }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: G, marginBottom: 8 }}>Inga deals hittades</h3>
            <p>Prova att andra dina filter</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filtered.map(deal => (
              <Link key={deal.id} href={'/deals/' + deal.id} style={{ textDecoration: 'none' }}>
                <div style={{ background: WH, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                  <div style={{ height: 200, background: deal.color, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                    <span style={{ position: 'absolute', top: 16, left: 16, background: AU, color: WH, borderRadius: 999, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>-{deal.discount}%</span>
                    {deal.featured && <span style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', color: WH, borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>UTVALT</span>}
                    <span style={{ background: 'rgba(0,0,0,0.4)', color: WH, borderRadius: 999, padding: '4px 12px', fontSize: 12 }}>{deal.category}</span>
                  </div>
                  <div style={{ padding: 20 }}>
                    <p style={{ color: AU, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>{deal.merchant} · {deal.city}</p>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: G, margin: '0 0 12px', lineHeight: 1.3 }}>{deal.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: 22, fontWeight: 700, color: G }}>{deal.price.toLocaleString('sv-SE')} kr</span>
                        <span style={{ fontSize: 14, color: GR, textDecoration: 'line-through', marginLeft: 8 }}>{deal.original.toLocaleString('sv-SE')} kr</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: GR, fontSize: 13 }}>
                        <span style={{ color: '#F59E0B' }}>&#9733;</span>
                        <span>{deal.rating} ({deal.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <footer style={{ background: G, color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '32px 24px', marginTop: 40, fontSize: 14 }}>
        <p style={{ margin: 0 }}>2026 Valor AB · Premium deals i din stad</p>
      </footer>
    </div>
  )
}
