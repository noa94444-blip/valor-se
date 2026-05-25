// @ts-nocheck
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'VALÖR – Premium deals i din stad',
  description: 'Hitta de bästa lokala erbjudandena på bilservice, restauranger, skönhet och mer. Spara upp till 50% med VALÖR.',
  openGraph: {
    title: 'VALÖR – Premium deals i din stad',
    description: 'Hitta de bästa lokala erbjudandena. Spara upp till 50% med VALÖR.',
    images: ['/og-image.png']
  }
}

async function getDeals() {
  const { data } = await supabase.from('deals').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(12)
  return data || []
}

export default async function HomePage() {
  const deals = await getDeals()
  const categories = [...new Set(deals.map(d => d.category).filter(Boolean))]

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif', color: '#fff' }}>
      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 800, color: '#c9a84c', letterSpacing: '-1px', textDecoration: 'none' }}>VALÖR</Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/deals" style={{ color: '#888', fontSize: 13, textDecoration: 'none', padding: '8px 14px', borderRadius: 8, transition: 'color 0.15s' }}>Alla deals</Link>
          <Link href="/konto" style={{ color: '#888', fontSize: 13, textDecoration: 'none', padding: '8px 14px', borderRadius: 8 }}>Konto</Link>
          <Link href="/merchant" style={{ background: '#1a1a1a', color: '#c9a84c', fontSize: 12, textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 600, border: '1px solid #333' }}>Merchant</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 32px 60px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#1a1200', border: '1px solid #c9a84c44', borderRadius: 100, padding: '6px 16px', fontSize: 12, color: '#c9a84c', fontWeight: 600, marginBottom: 24, letterSpacing: '1px', textTransform: 'uppercase' }}>Premium deals — Verified quality</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 20 }}>
          Exklusiva deals<br />
          <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>i din stad</span>
        </h1>
        <p style={{ fontSize: 18, color: '#888', lineHeight: 1.6, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>Bilservice, restauranger, skönhet, spa och mer — upp till 50% rabatt på premiumtjänster nära dig.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/deals" style={{ background: '#c9a84c', color: '#0a0a0a', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block', letterSpacing: '-0.3px' }}>Se alla deals →</Link>
          <Link href="/merchant" style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '14px 24px', borderRadius: 10, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>Bli merchant</Link>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { value: deals.length + '+', label: 'Aktiva deals' },
            { value: '50%', label: 'Max rabatt' },
            { value: categories.length + '+', label: 'Kategorier' },
            { value: '15%', label: 'Kommission' }
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#c9a84c' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section style={{ padding: '40px 32px 0' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/deals" style={{ background: '#c9a84c', color: '#0a0a0a', padding: '8px 18px', borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Alla</Link>
            {categories.map(cat => (
              <Link key={cat} href={`/deals?kategori=${encodeURIComponent(cat)}`} style={{ background: '#111', border: '1px solid #222', color: '#888', padding: '8px 18px', borderRadius: 100, fontSize: 12, textDecoration: 'none' }}>{cat}</Link>
            ))}
          </div>
        </section>
      )}

      {/* DEALS GRID */}
      <section style={{ padding: '40px 32px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>Utvalda deals</h2>
          <Link href="/deals" style={{ color: '#c9a84c', fontSize: 13, textDecoration: 'none' }}>Se alla →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {deals.map(deal => {
            const discount = deal.original_price && deal.deal_price ? Math.round((1 - deal.deal_price / deal.original_price) * 100) : 0
            return (
              <Link key={deal.id} href={`/deals/${deal.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  {/* Card image placeholder */}
                  <div style={{ height: 140, background: 'linear-gradient(135deg, #1a1200, #2a1a00)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: 40 }}>{deal.category === 'Bilservice' ? '🚗' : deal.category === 'Restaurang' ? '🍽️' : deal.category === 'Skönhet' ? '💆' : '✨'}</span>
                    {discount > 0 && (
                      <div style={{ position: 'absolute', top: 12, right: 12, background: '#c9a84c', color: '#0a0a0a', fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 6 }}>-{discount}%</div>
                    )}
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <div style={{ fontSize: 11, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 8 }}>{deal.category || 'Deal'}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 12 }}>{deal.title}</div>
                    <div style={{ fontSize: 12, color: '#555', marginBottom: 14, lineHeight: 1.5 }}>{(deal.description || '').substring(0, 80)}{(deal.description || '').length > 80 ? '...' : ''}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#c9a84c' }}>{deal.deal_price} kr</span>
                        {deal.original_price && <span style={{ fontSize: 12, color: '#555', textDecoration: 'line-through', marginLeft: 8 }}>{deal.original_price} kr</span>}
                      </div>
                      <span style={{ background: '#1a1a1a', color: '#888', fontSize: 11, padding: '4px 10px', borderRadius: 6 }}>{deal.sold_count || 0} köpta</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
          {deals.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 24px', color: '#444' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Deals kommer snart</div>
              <div style={{ fontSize: 14 }}>Vi laddar upp exklusiva erbjudanden</div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#c9a84c', letterSpacing: '-0.5px', marginBottom: 12 }}>VALÖR</div>
        <div style={{ color: '#444', fontSize: 13, marginBottom: 16 }}>Premium deals i din stad</div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/deals" style={{ color: '#555', fontSize: 12, textDecoration: 'none' }}>Deals</Link>
          <Link href="/merchant" style={{ color: '#555', fontSize: 12, textDecoration: 'none' }}>Merchant</Link>
          <Link href="/konto" style={{ color: '#555', fontSize: 12, textDecoration: 'none' }}>Konto</Link>
          <Link href="/admin" style={{ color: '#333', fontSize: 12, textDecoration: 'none' }}>Admin</Link>
        </div>
        <div style={{ color: '#2a2a2a', fontSize: 11, marginTop: 20 }}>© 2025 VALÖR. 15% kommission på alla affärer.</div>
      </footer>
    </main>
  )
}
