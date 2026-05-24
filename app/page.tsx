'use client'
import { useState } from 'react'
import Link from 'next/link'

const C = {
  forest: '#1A3A2A',
  forestDark: '#0D1F14',
  forestMid: '#2A5A3A',
  gold: '#C4974A',
  ivory: '#F5F2ED',
  ivoryDark: '#EDE9E2',
  white: '#FFFFFF',
  gray: '#6B7280',
  grayLight: '#F9F8F6',
}

const SAMPLE_DEALS = [
  { id: 1, title: 'Massage 60 min + fotvård', merchant: 'Aura Spa & Wellness', category: 'Skönhet', price: 549, originalPrice: 1200, discount: 54, city: 'Stockholm', rating: 4.9, sold: 142 },
  { id: 2, title: '3-rätters middag för 2 pers', merchant: 'Restaurang Tvåkanten', category: 'Mat & Dryck', price: 699, originalPrice: 1400, discount: 50, city: 'Göteborg', rating: 4.7, sold: 89 },
  { id: 3, title: 'Golf 18 hål + lunch inkl.', merchant: 'Barsebäck Golf & Country', category: 'Sport', price: 895, originalPrice: 1650, discount: 46, city: 'Malmö', rating: 4.8, sold: 58 },
  { id: 4, title: 'Tesla-service komplett', merchant: 'AutoPremium Sverige', category: 'Bil & Service', price: 1799, originalPrice: 2899, discount: 38, city: 'Stockholm', rating: 4.6, sold: 67 },
  { id: 5, title: 'Yoga retreat helg', merchant: 'Inner Peace Studio', category: 'Hälsa', price: 1299, originalPrice: 2199, discount: 41, city: 'Göteborg', rating: 4.8, sold: 34 },
  { id: 6, title: 'Vinprovning för 2', merchant: 'Vinkällaren', category: 'Upplevelse', price: 599, originalPrice: 990, discount: 39, city: 'Malmö', rating: 4.9, sold: 201 },
  { id: 7, title: 'Padel 2h + utrustning', merchant: 'PadelCity Stockholm', category: 'Sport', price: 395, originalPrice: 720, discount: 45, city: 'Stockholm', rating: 4.7, sold: 312 },
  { id: 8, title: 'Hotellnatt + frukost', merchant: 'Clarion Hotel Post', category: 'Resa & Boende', price: 1195, originalPrice: 2100, discount: 43, city: 'Göteborg', rating: 4.8, sold: 76 },
]

const CATEGORIES = ['Alla', 'Skönhet', 'Mat & Dryck', 'Sport', 'Hälsa', 'Upplevelse', 'Resa & Boende', 'Bil & Service']
const CITIES = ['Alla städer', 'Stockholm', 'Göteborg', 'Malmö']

const gradients = [
  'linear-gradient(135deg, #1A3A2A 0%, #2A5A3A 100%)',
  'linear-gradient(135deg, #2D4A3E 0%, #1A3A2A 100%)',
  'linear-gradient(135deg, #1E3A5F 0%, #2A5A3A 100%)',
  'linear-gradient(135deg, #3D2A1A 0%, #5A3A2A 100%)',
]

function DealCard({ deal, featured = false }: { deal: typeof SAMPLE_DEALS[0], featured?: boolean }) {
  const price = deal.price || 0
  const originalPrice = deal.originalPrice || 0
  return (
    <Link href={'/deals/' + deal.id} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: C.white, borderRadius: featured ? 20 : 16, overflow: 'hidden', boxShadow: featured ? '0 8px 32px rgba(26,58,42,0.15)' : '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid ' + C.ivoryDark, cursor: 'pointer' }}>
        <div style={{ height: featured ? 200 : 160, background: gradients[deal.id % gradients.length], position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
          <span style={{ position: 'absolute', top: 14, left: 14, background: C.gold, color: C.white, fontSize: 13, fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>-{deal.discount}%</span>
          <span style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.4)', color: C.white, fontSize: 11, padding: '3px 8px', borderRadius: 10 }}>{deal.city}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{deal.category}</span>
        </div>
        <div style={{ padding: featured ? '18px 20px' : '14px 16px' }}>
          <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{deal.merchant}</div>
          <div style={{ fontSize: featured ? 16 : 14, fontWeight: 700, color: C.forestDark, marginBottom: 12, lineHeight: 1.4 }}>{deal.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: featured ? 22 : 18, fontWeight: 800, color: C.forest, fontFamily: 'Georgia, serif' }}>{price.toLocaleString('sv-SE')} kr</span>
              <span style={{ fontSize: 12, color: C.gray, textDecoration: 'line-through', marginLeft: 8 }}>{originalPrice.toLocaleString('sv-SE')} kr</span>
            </div>
            <div style={{ fontSize: 12, color: C.gray }}><span style={{ color: C.gold }}>★</span> <b>{deal.rating}</b> ({deal.sold})</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('Alla')
  const [activeCity, setActiveCity] = useState('Alla städer')
  const [menuOpen, setMenuOpen] = useState(false)

  const filtered = SAMPLE_DEALS.filter(d =>
    (activeCategory === 'Alla' || d.category === activeCategory) &&
    (activeCity === 'Alla städer' || d.city === activeCity)
  )

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ background: 'rgba(245,242,237,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid ' + C.ivoryDark, position: 'sticky', top: 0, zIndex: 100, padding: '0 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: C.forest, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 18 }}>V</div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: C.forest, letterSpacing: 1 }}>Valör</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="val-desktop-nav">
            {[['Alla deals','/deals'],['Skönhet','/deals?cat=Skönhet'],['Mat & Dryck','/deals?cat=Mat'],['Upplevelser','/deals?cat=Upplevelse']].map(([l,h]) => (
              <Link key={h} href={h} style={{ color: C.forest, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{l}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }} className="val-desktop-cta">
            <Link href="/logga-in" style={{ color: C.forest, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Logga in</Link>
            <Link href="/merchant" style={{ background: C.forest, color: C.gold, textDecoration: 'none', padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>För företag</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="val-hamburger" aria-label="Meny" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column' as const, gap: 5, alignItems: 'center' }}>
            <span style={{ width: 24, height: 2, background: C.forest, display: 'block', borderRadius: 2, transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none', transition: '0.2s' }}></span>
            <span style={{ width: 24, height: 2, background: C.forest, display: 'block', borderRadius: 2, opacity: menuOpen ? 0 : 1 }}></span>
            <span style={{ width: 24, height: 2, background: C.forest, display: 'block', borderRadius: 2, transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none', transition: '0.2s' }}></span>
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: C.white, borderTop: '1px solid ' + C.ivoryDark, padding: '16px 20px' }}>
            {[['Alla deals','/deals'],['Skönhet','/deals?cat=Skönhet'],['Mat & Dryck','/deals?cat=Mat'],['Upplevelser','/deals?cat=Upplevelse'],['Sport','/deals?cat=Sport'],['Hälsa','/deals?cat=Hälsa']].map(([l,h]) => (
              <Link key={h} href={h} onClick={() => setMenuOpen(false)} style={{ display: 'block', color: C.forestDark, textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '12px 0', borderBottom: '1px solid ' + C.ivoryDark }}>{l}</Link>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <Link href="/logga-in" style={{ flex: 1, textAlign: 'center' as const, padding: '12px', border: '2px solid ' + C.forest, borderRadius: 10, color: C.forest, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>Logga in</Link>
              <Link href="/merchant" style={{ flex: 1, textAlign: 'center' as const, padding: '12px', background: C.forest, borderRadius: 10, color: C.gold, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>För företag</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg, #0D1F14 0%, #1A3A2A 45%, #2A5040 100%)', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(196,151,74,0.08)', pointerEvents: 'none' as const }}></div>
        <div style={{ maxWidth: 800, textAlign: 'center' as const, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(196,151,74,0.15)', border: '1px solid rgba(196,151,74,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>✦ Kurerade premium deals</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 700, color: C.white, margin: '0 0 16px', lineHeight: 1.1 }}>Upplev mer.</h1>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 7vw, 64px)', fontWeight: 700, color: C.gold, margin: '0 0 28px', lineHeight: 1.1 }}>Betala mindre.</h2>
          <p style={{ fontSize: 'clamp(15px, 3vw, 19px)', color: 'rgba(255,255,255,0.75)', margin: '0 auto 44px', lineHeight: 1.7, maxWidth: 560 }}>Handplockade erbjudanden på spa, restauranger och upplevelser — för den som vill ha det bästa utan att betala fullt pris.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/deals" style={{ background: C.gold, color: C.forestDark, textDecoration: 'none', padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px rgba(196,151,74,0.4)', display: 'inline-block' }}>Utforska alla deals →</Link>
            <Link href="/merchant" style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', color: C.white, textDecoration: 'none', padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 600, display: 'inline-block' }}>För företag</Link>
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' as const }}>
            {[['2 400+','Nöjda kunder'],['180+','Premium deals'],['4.9','Snittbetyg'],['48h','Support']].map(([v,l]) => (
              <div key={l} style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 800, color: C.gold, fontFamily: 'Georgia, serif' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DEALS */}
      <section style={{ background: C.white, padding: '64px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap' as const, gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8 }}>✦ Utvalt</div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, color: C.forestDark, margin: 0 }}>Veckans bästa deals</h2>
            </div>
            <Link href="/deals" style={{ color: C.gold, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Visa alla →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {SAMPLE_DEALS.slice(0, 4).map(deal => <DealCard key={deal.id} deal={deal} featured />)}
          </div>
        </div>
      </section>

      {/* FILTER + ALL DEALS */}
      <section style={{ background: C.ivory, padding: '64px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: C.forestDark, marginBottom: 24 }}>Utforska deals</h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' as const }}>
            {CITIES.map(city => (
              <button key={city} onClick={() => setActiveCity(city)} style={{ padding: '8px 18px', borderRadius: 20, border: '2px solid ' + (activeCity === city ? C.forest : C.ivoryDark), background: activeCity === city ? C.forest : C.white, color: activeCity === city ? C.white : C.gray, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{city}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' as const }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '7px 16px', borderRadius: 20, border: '1px solid ' + (activeCategory === cat ? C.gold : C.ivoryDark), background: activeCategory === cat ? C.gold : C.white, color: activeCategory === cat ? C.forestDark : C.gray, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{cat}</button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center' as const, padding: '60px 20px', color: C.gray }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Inga deals hittades</p>
              <p style={{ marginTop: 8 }}>Prova ett annat filter</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {filtered.map(deal => <DealCard key={deal.id} deal={deal} />)}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: C.white, padding: '64px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' as const }}>
          <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 }}>Enkel process</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, color: C.forestDark, marginBottom: 48 }}>Så här fungerar det</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[['01','Hitta din deal','Bläddra bland handplockade erbjudanden från kurerade partners i din stad.'],['02','Köp direkt','Säkert köp på sekunder. Du får din voucher direkt via e-post och i appen.'],['03','Lös in & njut','Visa QR-koden hos merchant och njut av din upplevelse till bästa pris.']].map(([step,title,desc]) => (
              <div key={step} style={{ padding: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: C.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, margin: '0 auto 20px' }}>{step}</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: C.forestDark, marginBottom: 12 }}>{title}</h3>
                <p style={{ color: C.gray, fontSize: 15, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: C.ivory, padding: '64px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' as const }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: C.forestDark, marginBottom: 40 }}>Vad kunderna säger</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              ['Fantastisk upplevelse på Aura Spa — bättre än förväntat och till halva priset! Kommer definitivt använda Valör igen.','Emma L.','Stockholm'],
              ['Hittade en otrolig middag på Tvåkanten via Valör. Restaurangen var exklusiv och servicen helt felfri.','Marcus B.','Göteborg'],
              ['Vinprovningen var en perfekt present till min partner. Smidigt att köpa och enkelt att lösa in med QR-koden.','Sofia A.','Malmö'],
            ].map(([text,name,city]) => (
              <div key={name} style={{ background: C.white, borderRadius: 16, padding: 28, textAlign: 'left' as const, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid ' + C.ivoryDark }}>
                <div style={{ color: C.gold, fontSize: 18, marginBottom: 16 }}>★★★★★</div>
                <p style={{ color: C.forestDark, fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>"{text}"</p>
                <div style={{ fontWeight: 700, color: C.forest, fontSize: 14 }}>{name}</div>
                <div style={{ color: C.gray, fontSize: 12 }}>{city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.forestDark, padding: '64px 20px', textAlign: 'center' as const }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 700, color: C.white, marginBottom: 20 }}>Redo att spara?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, marginBottom: 40, lineHeight: 1.6 }}>Gå med i 2 400+ kunder som redan upplever mer för mindre.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/deals" style={{ background: C.gold, color: C.forestDark, textDecoration: 'none', padding: '16px 40px', borderRadius: 12, fontSize: 16, fontWeight: 700, display: 'inline-block' }}>Hitta din deal →</Link>
            <Link href="/registrera" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', color: C.white, textDecoration: 'none', padding: '16px 40px', borderRadius: 12, fontSize: 16, fontWeight: 600, display: 'inline-block' }}>Skapa konto gratis</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#081810', padding: '52px 20px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: C.forest, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 16 }}>V</div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: C.white, letterSpacing: 1 }}>Valör</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Premium deals för den kräsne kunden. Upplev mer. Betala mindre.</p>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: C.white, marginBottom: 16, fontSize: 14 }}>Deals</div>
              {['Skönhet','Mat & Dryck','Upplevelse','Sport','Resa'].map(c => <div key={c} style={{ marginBottom: 8 }}><Link href={'/deals?cat=' + c} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{c}</Link></div>)}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: C.white, marginBottom: 16, fontSize: 14 }}>Städer</div>
              {['Stockholm','Göteborg','Malmö'].map(c => <div key={c} style={{ marginBottom: 8 }}><Link href={'/deals?city=' + c} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{c}</Link></div>)}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: C.white, marginBottom: 16, fontSize: 14 }}>Företag</div>
              {[['/merchant','Bli merchant'],['/konto','Mitt konto']].map(([h,l]) => <div key={h} style={{ marginBottom: 8 }}><Link href={h} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>{l}</Link></div>)}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2026 Valör. Alla rättigheter förbehållna.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Integritetspolicy','Villkor','Kontakt'].map(l => <Link key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: 13 }}>{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .val-desktop-nav, .val-desktop-cta { display: none !important; }
          .val-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .val-hamburger { display: none !important; }
        }
      `}</style>
    </div>
  )
}
