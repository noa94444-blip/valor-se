import Link from 'next/link'
import { notFound } from 'next/navigation'
import BuyButton from './BuyButton'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'

const DEALS = [
  { id: 'massage-fotvard', title: 'Massage 60 min + fotvard', merchant: 'Aura Spa & Wellness', city: 'Stockholm', category: 'Skonhet', price: 549, original: 1099, discount: 50, rating: 4.9, reviews: 142, color: '#2D5A3D', description: 'Njut av en avkopplande helkroppsmassage pa 60 minuter kombinerat med en lyxig fotvard. Vara erfarna terapeuter anpassar behandlingen efter dina behov. Inkluderar: valkommen med te, klader, dusch och avslapningsrum.', includes: ['60 min helkroppsmassage', 'Fotvard 30 min', 'Te & frukt', 'Dusch & omkladningsrum'], valid: '2026-08-31', slug: 'massage-fotvard' },
  { id: 'middag-tvakanten', title: '3-ratters middag for tva', merchant: 'Restaurang Tvakanten', city: 'Goteborg', category: 'Mat & Dryck', price: 699, original: 1398, discount: 50, rating: 4.7, reviews: 89, color: '#3D4A2D', description: 'Upplev en magnifik 3-ratters middag for tva pa Restaurang Tvakanten, Goteborgs mest omtalade fine dining destination. Menyn andras efter sasong.', includes: ['Forrat for 2', 'Varmratt for 2', 'Dessert for 2', 'Vatten & brod'], valid: '2026-07-31', slug: 'middag-tvakanten' },
  { id: 'yoga-retreat', title: 'Yoga retreat helg', merchant: 'Inner Peace Studio', city: 'Goteborg', category: 'Halsa', price: 1299, original: 2199, discount: 41, rating: 4.8, reviews: 34, color: '#2D3A4A', description: 'En transformativ helgupplevelse med yoga, meditation och mindfulness. Lad upp kroppens och sjalens batterier pa Inner Peace Studio.', includes: ['2 yogapass', 'Meditationssession', 'Vegansk lunch', 'Yogamatta och props'], valid: '2026-09-30', slug: 'yoga-retreat' },
  { id: 'tesla-service', title: 'Tesla-service komplett', merchant: 'AutoPremium Sverige', city: 'Stockholm', category: 'Bil & Service', price: 1799, original: 2899, discount: 38, rating: 4.6, reviews: 67, color: '#3A2D1A', description: 'Komplett service for din Tesla. Vi ar certifierade Tesla-tekniker med over 500 genomforda servicar. Inkluderar diagnostik, bromsinspektion och uppdatering.', includes: ['Full diagnostik', 'Bromskontroll', 'Dackinspektion', 'Software-uppdatering'], valid: '2026-12-31', slug: 'tesla-service' },
  { id: 'vinprovning', title: 'Vinprovning for 2', merchant: 'Vinkallaren', city: 'Malmo', category: 'Mat & Dryck', price: 599, original: 1099, discount: 45, rating: 4.9, reviews: 201, color: '#4A2D3A', description: 'En guidad vinprovning for tva med fokus pa europeiska viner. Var sommelier guidar er genom sju utsokta viner med tillhorande ostbricka.', includes: ['7 viner att prova', 'Ostbricka for 2', 'Guidad provning av sommelier', 'Vinguide att ta hem'], valid: '2026-10-31', slug: 'vinprovning' },
  { id: 'golf-lunch', title: 'Golf 18 hal + lunch', merchant: 'Barseback Golf', city: 'Malmo', category: 'Sport', price: 895, original: 1650, discount: 46, rating: 4.5, reviews: 58, color: '#2D4A2D', description: 'Spela 18 hal pa den legendariska Barseback Golf & Country Club, en av Skandinaviens mest prestige-fyllda golfbanor, med lunch inkluderad.', includes: ['18 hal greenfee', 'Lunch i clubhouse', 'Driving range fore ronden', 'GPS pa golfbilen'], valid: '2026-09-30', slug: 'golf-lunch' },
  { id: 'padel', title: 'Padel 2h + utrustning', merchant: 'PadelCity Stockholm', city: 'Stockholm', category: 'Sport', price: 395, original: 799, discount: 51, rating: 4.8, reviews: 312, color: '#1A2D4A', description: 'Boka en padelbana i 2 timmar pa PadelCity Stockholm med all utrustning inkluderad. Perfekt for bade nybojare och erfarna spelare.', includes: ['2h banbokning', 'Racket & bollar', 'Omkladningsrum & dusch', 'Instruktionsvideo for nybojare'], valid: '2026-12-31', slug: 'padel' },
  { id: 'hotell-frukost', title: 'Hotellnatt + frukost', merchant: 'Clarion Hotel Post', city: 'Goteborg', category: 'Resa & Boende', price: 1195, original: 2100, discount: 43, rating: 4.7, reviews: 76, color: '#2D1A3A', description: 'Bo en natt pa lyxiga Clarion Hotel Post i centrala Goteborg, ett ikoniskt hotell inrymt i det gamla posthuset fran 1925. Frukost ingar.', includes: ['Dubbelrum 1 natt', 'Frukostbuffet for 2', 'Tillgang till gym & spa', 'Sen utcheckning kl 14:00'], valid: '2026-11-30', slug: 'hotell-frukost' }
]

function getDeal(slug) { return DEALS.find(d => d.slug === slug) || null }

export function generateStaticParams() {
  return DEALS.map(d => ({ slug: d.slug }))
}

export default function DealPage({ params }: { params: { slug: string } }) {
  const deal = getDeal(params.slug)
  if (!deal) notFound()

  const related = DEALS.filter(d => d.slug !== deal.slug && d.category === deal.category).slice(0, 3)

  return (
    <div style={{ background: IV, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* NAV */}
      <nav style={{ background: WH, borderBottom: '1px solid #E8E4DF', position: 'sticky', top: 0, zIndex: 50, padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: G, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AU, fontWeight: 700, fontSize: 16 }}>V</div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: G }}>Valor</span>
          </Link>
          <Link href='/deals' style={{ fontSize: 14, color: GR, textDecoration: 'none' }}>Alla deals</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
          {/* LEFT */}
          <div>
            {/* IMAGE */}
            <div style={{ height: 360, background: deal.color, borderRadius: 20, marginBottom: 32, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 24 }}>
              <span style={{ position: 'absolute', top: 20, left: 20, background: AU, color: WH, borderRadius: 999, padding: '6px 16px', fontSize: 15, fontWeight: 700 }}>-{deal.discount}%</span>
              <span style={{ background: 'rgba(0,0,0,0.4)', color: WH, borderRadius: 999, padding: '6px 16px', fontSize: 13 }}>{deal.category}</span>
            </div>
            {/* DETAILS */}
            <div style={{ background: WH, borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: G, margin: '0 0 16px' }}>Vad ingaar?</h2>
              {deal.includes.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < deal.includes.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                  <span style={{ width: 24, height: 24, background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#16A34A', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 15, color: '#333' }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: WH, borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: G, margin: '0 0 12px' }}>Om erbjudandet</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: 0 }}>{deal.description}</p>
            </div>
          </div>
          {/* RIGHT */}
          <div>
            <div style={{ background: WH, borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', position: 'sticky', top: 84 }}>
              <p style={{ color: AU, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>{deal.merchant} · {deal.city}</p>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: G, margin: '0 0 16px', lineHeight: 1.3 }}>{deal.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ color: '#F59E0B', fontSize: 18 }}>★</span>
                <span style={{ fontWeight: 600, color: G }}>{deal.rating}</span>
                <span style={{ color: GR, fontSize: 13 }}>({deal.reviews} recensioner)</span>
              </div>
              <div style={{ background: IV, borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: G }}>{deal.price.toLocaleString('sv-SE')} kr</span>
                  <span style={{ fontSize: 16, color: GR, textDecoration: 'line-through' }}>{deal.original.toLocaleString('sv-SE')} kr</span>
                </div>
                <span style={{ fontSize: 14, color: '#16A34A', fontWeight: 600 }}>Du sparar {(deal.original - deal.price).toLocaleString('sv-SE')} kr</span>
              </div>
              <BuyButton deal={deal} />
              <div style={{ marginTop: 16, padding: '12px 16px', background: '#F0FDF4', borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: '#16A34A', margin: '0 0 4px', fontWeight: 600 }}>Giltig till {deal.valid}</p>
                <p style={{ fontSize: 12, color: GR, margin: 0 }}>Voucher skickas direkt till din e-post</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: G, margin: '0 0 24px' }}>Fler deals du kan gilla</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {related.map(r => (
                <Link key={r.slug} href={'/deals/' + r.slug} style={{ textDecoration: 'none' }}>
                  <div style={{ background: WH, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{ height: 140, background: r.color, position: 'relative' }}>
                      <span style={{ position: 'absolute', top: 12, left: 12, background: AU, color: WH, borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>-{r.discount}%</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <p style={{ color: AU, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>{r.merchant}</p>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: G, margin: '0 0 8px' }}>{r.title}</h3>
                      <span style={{ fontSize: 18, fontWeight: 700, color: G }}>{r.price.toLocaleString('sv-SE')} kr</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: G, color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 48, fontSize: 13 }}>
        <p style={{ margin: 0 }}>2026 Valor AB</p>
      </footer>
    </div>
  )
}
