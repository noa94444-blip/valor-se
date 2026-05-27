// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BuyButton from './BuyButton'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CATEGORY_LABEL = {
  spa: 'Spa & Hälsa',
  restaurang: 'Restaurang',
  upplevelser: 'Upplevelser',
  sport: 'Sport',
  skönhet: 'Skönhet',
  resor: 'Resa och boende',
  hotell: 'Hotell',
  fitness: 'Fitness',
  'bil och service': 'Bil och service',
  'mat och dryck': 'Mat och dryck',
}

const CATEGORY_EMOJI = {
  spa: '🧖',
  restaurang: '🍽️',
  upplevelser: '✨',
  sport: '⛳',
  skönhet: '💆',
  resor: '✈️',
  hotell: '🏨',
  fitness: '💪',
  'bil och service': '🚗',
  'mat och dryck': '🍷',
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { data: deal } = await supabase
    .from('deals')
    .select('title, description, image_url, original_price, deal_price')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!deal) return { title: 'Erbjudande | VALÖR' }

  const savings = deal.original_price && deal.deal_price
    ? Math.round(((deal.original_price - deal.deal_price) / deal.original_price) * 100)
    : 0

  return {
    title: deal.title + ' | VALÖR',
    description: deal.description || 'Exklusivt erbjudande på VALÖR',
    openGraph: {
      title: deal.title,
      description: (savings > 0 ? savings + '% rabatt - ' : '') + (deal.description || ''),
      images: deal.image_url ? [deal.image_url] : [],
      type: 'website',
      siteName: 'VALÖR',
      url: `https://xn--valr-ppa.se/deals/${resolvedParams.slug}`,
    },
    alternates: {
      canonical: `https://xn--valr-ppa.se/deals/${resolvedParams.slug}`,
    },
  }
}

export default async function DealPage({ params }: Props) {
  const resolvedParams = await params

  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!deal) notFound()

  const savings = deal.original_price && deal.deal_price
    ? Math.round(((deal.original_price - deal.deal_price) / deal.original_price) * 100)
    : 0

  const displayCategory = CATEGORY_LABEL[deal.category?.toLowerCase()] || deal.category || 'Erbjudande'
  const categoryEmoji = CATEGORY_EMOJI[deal.category?.toLowerCase()] || '🎁'

  return (
    <div style={{ minHeight: '100vh', background: '#1C1A17', color: '#F5F2ED' }}>
      {/* Breadcrumbs */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '16px 20px 0' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#8C7B5E', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#8C7B5E', textDecoration: 'none' }}>Hem</Link>
          <span>/</span>
          <Link href="/deals" style={{ color: '#8C7B5E', textDecoration: 'none' }}>Erbjudanden</Link>
          <span>/</span>
          <span style={{ color: '#C9A84C', fontWeight: '500' }}>{deal.title}</span>
        </nav>
      </div>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '20px 20px 64px' }}>
        {/* Mobile: stack, Desktop: side-by-side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '32px'
        }}>
          <style>{`
            @media (min-width: 768px) {
              .deal-grid { grid-template-columns: 1fr 1fr !important; gap: 48px !important; }
            }
            @media (min-width: 1024px) {
              .deal-grid { gap: 64px !important; }
            }
          `}</style>
          
          <div className="deal-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '32px'
          }}>
            {/* Left: Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                paddingTop: '75%',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #2A2520 0%, #1C1A17 50%, #232019 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}>
                {deal.image_url ? (
                  <img
                    src={deal.image_url}
                    alt={deal.title}
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%', objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #2A2720 0%, #1a1814 100%)'
                  }}>
                    <div style={{ fontSize: '64px', marginBottom: '12px', opacity: 0.6 }}>{categoryEmoji}</div>
                    <div style={{ fontSize: '13px', color: '#5C4E38', letterSpacing: '2px', textTransform: 'uppercase' }}>VALÖR</div>
                  </div>
                )}
              </div>
              {savings > 0 && (
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: '#2D5A3A', color: 'white',
                  fontSize: '13px', fontWeight: 'bold',
                  padding: '6px 12px', borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  letterSpacing: '0.5px'
                }}>
                  -{savings}% RABATT
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Category */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(201,168,76,0.1)', color: '#C9A84C',
                  fontSize: '11px', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '2px',
                  padding: '6px 14px', borderRadius: '20px',
                  border: '1px solid rgba(201,168,76,0.2)'
                }}>
                  {displayCategory}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 'bold', color: '#F5F2ED',
                lineHeight: 1.2, margin: 0
              }}>
                {deal.title}
              </h1>

              {/* Description */}
              {deal.description && (
                <p style={{ color: '#A89880', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>
                  {deal.description}
                </p>
              )}

              {/* Merchant */}
              {deal.merchant_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#8C7B5E' }}>
                  <span>🏪</span>
                  <span>Av <strong style={{ color: '#C9A84C' }}>{deal.merchant_name}</strong></span>
                </div>
              )}

              {/* Location */}
              {deal.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#8C7B5E' }}>
                  <span>📍</span>
                  <span>{deal.location}</span>
                </div>
              )}

              {/* Price Block */}
              <div style={{
                background: '#2A2720', borderRadius: '16px',
                padding: '20px', border: '1px solid #3A3530'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: 'clamp(32px, 8vw, 42px)', fontWeight: 'bold', color: '#C9A84C', lineHeight: 1 }}>
                      {deal.deal_price?.toLocaleString('sv-SE')} kr
                    </div>
                    {deal.original_price && deal.original_price > deal.deal_price && (
                      <div style={{ fontSize: '14px', color: '#8C7B5E', textDecoration: 'line-through', marginTop: '4px' }}>
                        Ord. {deal.original_price?.toLocaleString('sv-SE')} kr
                      </div>
                    )}
                  </div>
                  {savings > 0 && (
                    <div style={{
                      fontSize: '13px', fontWeight: '600',
                      color: '#4ade80', background: 'rgba(45,90,58,0.2)',
                      padding: '6px 10px', borderRadius: '8px',
                      border: '1px solid rgba(45,90,58,0.3)'
                    }}>
                      Du sparar {(deal.original_price - deal.deal_price).toLocaleString('sv-SE')} kr
                    </div>
                  )}
                </div>

                {deal.valid_until && (
                  <div style={{ fontSize: '12px', color: '#8C7B5E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⏱</span>
                    Giltigt till {new Date(deal.valid_until).toLocaleDateString('sv-SE')}
                  </div>
                )}

                <BuyButton
                  dealId={deal.id}
                  dealTitle={deal.title}
                  dealPrice={deal.deal_price}
                  merchantId={deal.merchant_id}
                />

                <p style={{
                  fontSize: '12px', color: '#8C7B5E',
                  textAlign: 'center', marginTop: '12px', marginBottom: 0,
                  lineHeight: 1.5
                }}>
                  🔒 Säker betalning · ⚡ Omedelbar leverans · 14 dagars öppet köp
                </p>
              </div>

              {/* Terms */}
              {deal.terms && (
                <div style={{
                  background: 'rgba(201,168,76,0.05)', borderRadius: '12px',
                  padding: '16px', border: '1px solid rgba(201,168,76,0.1)'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#C9A84C', marginBottom: '8px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Villkor
                  </h3>
                  <p style={{ fontSize: '13px', color: '#8C7B5E', lineHeight: 1.6, margin: 0 }}>{deal.terms}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{
          marginTop: '48px', paddingTop: '32px',
          borderTop: '1px solid #2A2720'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: 'clamp(24px, 5vw, 64px)',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: '🔒', text: 'Säker betalning' },
              { icon: '⚡', text: 'Direkt leverans' },
              { icon: '💬', text: 'Support dygnet runt' },
              { icon: '↩️', text: '14 dagars öppet köp' },
            ].map(item => (
              <div key={item.text} style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontSize: '11px', color: '#8C7B5E', fontWeight: '500', letterSpacing: '0.5px' }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
