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

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-[#8C7B5E]">
          <Link href="/" className="hover:text-[#1C1A17] transition-colors">Hem</Link>
          <span>/</span>
          <Link href="/deals" className="hover:text-[#1C1A17] transition-colors">Erbjudanden</Link>
          <span>/</span>
          <span className="text-[#1C1A17] font-medium truncate max-w-[200px]">{deal.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#E8E2D9] shadow-lg">
              {deal.image_url ? (
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl opacity-30">🎁</span>
                </div>
              )}
            </div>
            {savings > 0 && (
              <div className="absolute top-4 left-4 bg-[#2D5A3A] text-white text-sm font-bold px-3 py-1.5 rounded-full shadow">
                -{savings}% RABATT
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-6">
            {/* Category */}
            <div>
              <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-[#C9A84C]/20">
                {displayCategory}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1A17] leading-tight">
              {deal.title}
            </h1>

            {/* Description */}
            {deal.description && (
              <p className="text-[#5C4E38] text-base leading-relaxed">
                {deal.description}
              </p>
            )}

            {/* Merchant */}
            {deal.merchant_name && (
              <div className="flex items-center gap-2 text-sm text-[#8C7B5E]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Av <strong className="text-[#1C1A17]">{deal.merchant_name}</strong></span>
              </div>
            )}

            {/* Location */}
            {deal.location && (
              <div className="flex items-center gap-2 text-sm text-[#8C7B5E]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{deal.location}</span>
              </div>
            )}

            {/* Price Block */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D9]">
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <div className="text-4xl font-bold text-[#2D5A3A]">
                    {deal.deal_price?.toLocaleString('sv-SE')} kr
                  </div>
                  {deal.original_price && deal.original_price > deal.deal_price && (
                    <div className="text-sm text-[#8C7B5E] line-through mt-1">
                      Ord. {deal.original_price?.toLocaleString('sv-SE')} kr
                    </div>
                  )}
                </div>
                {savings > 0 && (
                  <div className="text-sm font-semibold text-[#2D5A3A] bg-[#2D5A3A]/10 px-2 py-1 rounded-lg">
                    Du sparar {(deal.original_price - deal.deal_price).toLocaleString('sv-SE')} kr
                  </div>
                )}
              </div>

              {/* Validity */}
              {deal.valid_until && (
                <div className="text-xs text-[#8C7B5E] mb-4 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Giltigt till {new Date(deal.valid_until).toLocaleDateString('sv-SE')}
                </div>
              )}

              <BuyButton
                dealId={deal.id}
                dealTitle={deal.title}
                dealPrice={deal.deal_price}
                merchantId={deal.merchant_id}
              />

              <p className="text-xs text-[#8C7B5E] text-center mt-3">
                Säker betalning · Omedelbar leverans · 14 dagars öppet köp
              </p>
            </div>

            {/* Terms */}
            {deal.terms && (
              <div className="bg-[#1C1A17]/5 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-[#1C1A17] mb-2">Villkor</h3>
                <p className="text-xs text-[#5C4E38] leading-relaxed">{deal.terms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-[#E8E2D9]">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-xs text-[#5C4E38] font-medium">Säker betalning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs text-[#5C4E38] font-medium">Direkt leverans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💬</div>
              <div className="text-xs text-[#5C4E38] font-medium">Support dygnet runt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
