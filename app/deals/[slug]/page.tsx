import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BuyButton from './BuyButton'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const LG = '#E8E4DE'

export const revalidate = 60

async function getDeal(slug: string) {
  const { data, error } = await supabase
    .from('deals')
    .select('*, merchants(name, slug, address, city, logo_url, description, category)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) return null
  return data
}

export default async function DealPage({ params }: { params: { slug: string } }) {
  const deal = await getDeal(params.slug)
  if (!deal) notFound()

  const merchant = deal.merchants
  const discountPct = deal.original_price > 0 ? Math.round((1 - deal.deal_price / deal.original_price) * 100) : 0
  const savings = deal.original_price - deal.deal_price

  return (
    <div style={{ minHeight: '100vh', backgroundColor: IV, fontFamily: 'Inter, sans-serif' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', fontSize: 13, color: GR }}>
          <a href="/" style={{ color: GR, textDecoration: 'none' }}>Hem</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <a href="/deals" style={{ color: GR, textDecoration: 'none' }}>Deals</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: G }}>{deal.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {/* Image */}
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 420, backgroundColor: G, position: 'relative', marginBottom: 32 }}>
              {deal.image_url ? (
                <img src={deal.image_url} alt={deal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, opacity: 0.3, color: WH }}>✦</div>
              )}
              {discountPct > 0 && (
                <div style={{ position: 'absolute', top: 20, right: 20, backgroundColor: AU, color: WH, padding: '6px 14px', borderRadius: 24, fontSize: 14, fontWeight: 700 }}>
                  -{discountPct}%
                </div>
              )}
            </div>

            {/* Merchant info */}
            {merchant && (
              <div style={{ backgroundColor: WH, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${LG}` }}>
                <div style={{ fontSize: 11, color: AU, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Från</div>
                <div style={{ fontSize: 20, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, marginBottom: 8 }}>{merchant.name}</div>
                {merchant.description && <p style={{ color: GR, fontSize: 14, lineHeight: 1.6, margin: '0 0 12px' }}>{merchant.description}</p>}
                {merchant.address && (
                  <div style={{ fontSize: 13, color: GR }}>📍 {merchant.address}, {merchant.city}</div>
                )}
                {!merchant.address && merchant.city && (
                  <div style={{ fontSize: 13, color: GR }}>📍 {merchant.city}</div>
                )}
              </div>
            )}

            {/* Description */}
            <div style={{ backgroundColor: WH, borderRadius: 12, padding: 24, border: `1px solid ${LG}` }}>
              <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 16px' }}>Om detta erbjudande</h2>
              <p style={{ color: GR, fontSize: 15, lineHeight: 1.8, margin: 0 }}>{deal.description}</p>
              
              {deal.includes && Array.isArray(deal.includes) && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 14, color: G, fontWeight: 600, marginBottom: 10 }}>Ingår i priset:</div>
                  {deal.includes.map((item: string, i: number) => (
                    <div key={i} style={{ fontSize: 14, color: GR, marginBottom: 6 }}>✓ {item}</div>
                  ))}
                </div>
              )}
              
              {deal.valid_until && (
                <div style={{ marginTop: 16, padding: '12px 16px', backgroundColor: IV, borderRadius: 8, fontSize: 13, color: GR }}>
                  ⏰ Erbjudandet gäller till {new Date(deal.valid_until).toLocaleDateString('sv-SE')}
                </div>
              )}
            </div>
          </div>

          {/* Right column - Buy box */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{ backgroundColor: WH, borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `1px solid ${LG}` }}>
              <div style={{ fontSize: 11, color: AU, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{deal.category}</div>
              <h1 style={{ fontSize: 22, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, lineHeight: 1.4, margin: '0 0 20px' }}>{deal.title}</h1>

              <div style={{ padding: '16px 0', borderTop: `1px solid ${LG}`, borderBottom: `1px solid ${LG}`, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: G }}>{deal.deal_price} kr</span>
                  {deal.original_price > deal.deal_price && (
                    <span style={{ fontSize: 16, color: GR, textDecoration: 'line-through' }}>{deal.original_price} kr</span>
                  )}
                </div>
                {savings > 0 && (
                  <div style={{ fontSize: 13, color: AU, fontWeight: 600 }}>Du sparar {savings} kr ({discountPct}% rabatt)</div>
                )}
              </div>

              <BuyButton deal={deal} />

              <div style={{ marginTop: 20, fontSize: 12, color: GR, lineHeight: 1.6 }}>
                <div style={{ marginBottom: 6 }}>✓ Säker betalning</div>
                <div style={{ marginBottom: 6 }}>✓ Voucher skickas direkt till din e-post</div>
                {deal.valid_until && (
                  <div>✓ Giltigt till {new Date(deal.valid_until).toLocaleDateString('sv-SE')}</div>
                )}
              </div>
              
              {deal.rating && (
                <div style={{ marginTop: 16, padding: '12px 16px', backgroundColor: IV, borderRadius: 8 }}>
                  <span style={{ color: AU }}>{'★'.repeat(Math.floor(deal.rating))}</span>
                  <span style={{ fontSize: 13, color: GR, marginLeft: 8 }}>{deal.rating} ({deal.review_count || 0} recensioner)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
