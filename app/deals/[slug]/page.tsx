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

const CATEGORY_LABEL: Record<string, string> = {
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

interface Props {
    params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params
    const { data: deal } = await supabase
      .from('deals').select('*').eq('slug', resolvedParams.slug).single()
    if (!deal) return { title: 'Deal hittades inte – Valör' }

  const discount = deal.original_price && deal.deal_price
      ? Math.round((1 - deal.deal_price / deal.original_price) * 100)
        : 0
    const desc = deal.description
      ? deal.description.substring(0, 155)
          : `Spara ${discount}% på ${deal.title}. Från ${deal.deal_price} kr. Kurerade deals på Valör.`

  return {
        title: `${deal.title}${discount > 0 ? ` – ${discount}% rabatt` : ''} – Valör`,
        description: desc,
        keywords: [deal.title, deal.category, 'deal', 'erbjudande', 'rabatt', 'Valör', 'Sverige'].filter(Boolean).join(', '),
        openGraph: {
                title: deal.title,
                description: desc,
                type: 'website',
                url: `https://xn--valr-ppa.se/deals/${resolvedParams.slug}`,
                siteName: 'Valör',
        },
        twitter: {
                card: 'summary_large_image',
                title: deal.title,
                description: desc,
        },
        alternates: {
                canonical: `https://xn--valr-ppa.se/deals/${resolvedParams.slug}`,
        },
  }
}

export default async function DealPage({ params }: Props) {
    const resolvedParams = await params
    const { data: deal } = await supabase
      .from('deals').select('*').eq('slug', resolvedParams.slug).single()

  if (!deal) notFound()

  const discount = deal.original_price && deal.deal_price
      ? Math.round((1 - deal.deal_price / deal.original_price) * 100)
        : null

  const spotsRemaining = deal.max_quantity
      ? Math.max(0, deal.max_quantity - (deal.sold_count || 0))
        : null

  const categoryLabel = CATEGORY_LABEL[deal.category?.toLowerCase()] || deal.category || 'Erbjudande'

  return (
        <div className="min-h-screen bg-[#F5F2ED]">
          {/* Breadcrumbs */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                      <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
                                <Link href="/" className="hover:text-[#8B6914] transition-colors">Hem</Link>
                                <span>/</span>
                                <Link href="/deals" className="hover:text-[#8B6914] transition-colors">Deals</Link>
                                <span>/</span>
                                <Link href={`/deals?category=${deal.category}`} className="hover:text-[#8B6914] transition-colors capitalize">
                                  {categoryLabel}
                                </Link>
                                <span>/</span>
                                <span className="text-gray-800 font-medium truncate max-w-[200px]">{deal.title}</span>
                      </nav>
              </div>
        
          {/* Main content */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                      
                        {/* Left: Image + Info */}
                                <div>
                                  {/* Deal image */}
                                            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-6 bg-gradient-to-br from-[#2D5A3A] to-[#1a3a24] flex items-center justify-center">
                                              {discount && (
                          <span className="absolute top-4 right-4 bg-[#8B6914] text-white text-sm font-bold px-3 py-1.5 rounded-full">
                                            -{discount}% RABATT
                          </span>
                                                          )}
                                              {deal.featured && (
                          <span className="absolute top-4 left-4 bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-bold px-3 py-1.5 rounded-full border border-[#C9A84C]/40 uppercase tracking-widest">
                                            ✦ Utvald Deal
                          </span>
                                                          )}
                                                          <span className="text-8xl select-none">✨</span>
                                            </div>
                                
                                  {/* Category badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                          <span className="text-xs font-bold tracking-widest text-[#8B6914] uppercase bg-[#8B6914]/10 px-3 py-1.5 rounded-full">
                                                                          ✦ {categoryLabel.toUpperCase()}
                                                          </span>
                                            </div>
                                
                                  {/* Title */}
                                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{deal.title}</h1>
                                
                                  {/* Description */}
                                  {deal.description && (
                        <p className="text-gray-600 text-base leading-relaxed mb-6">{deal.description}</p>
                                            )}
                                
                                  {/* What's included */}
                                  {deal.includes && Array.isArray(deal.includes) && deal.includes.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                                        <h2 className="text-base font-bold text-gray-900 mb-4">Vad ingår</h2>
                                        <ul className="space-y-2">
                                          {deal.includes.map((item: string, i: number) => (
                                              <li key={i} className="flex items-center gap-3 text-gray-700">
                                                                    <span className="text-[#2D5A3A] font-bold text-lg">✓</span>
                                                                    <span>{item}</span>
                                              </li>
                                            ))}
                                        </ul>
                        </div>
                                            )}
                                
                                  {/* Deal meta */}
                                            <div className="grid grid-cols-2 gap-4">
                                              {deal.valid_until && (
                          <div className="bg-white rounded-2xl p-4 border border-gray-100">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gäller till</p>
                                            <p className="text-gray-900 font-medium">
                                              {new Date(deal.valid_until).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                          </div>
                                                          )}
                                              {spotsRemaining !== null && (
                          <div className="bg-white rounded-2xl p-4 border border-gray-100">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Platser kvar</p>
                                            <p className={`font-medium ${spotsRemaining === 0 ? 'text-red-600' : spotsRemaining < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                                              {spotsRemaining === 0 ? 'Slutsåld' : `${spotsRemaining} av ${deal.max_quantity}`}
                                            </p>
                          </div>
                                                          )}
                                              {deal.rating && (
                          <div className="bg-white rounded-2xl p-4 border border-gray-100">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Betyg</p>
                                            <p className="text-gray-900 font-medium">
                                                                ⭐ {deal.rating} {deal.review_count ? `(${deal.review_count} rec.)` : ''}
                                            </p>
                          </div>
                                                          )}
                                              {deal.sold_count !== undefined && deal.sold_count > 0 && (
                          <div className="bg-white rounded-2xl p-4 border border-gray-100">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sålda</p>
                                            <p className="text-gray-900 font-medium">🔥 {deal.sold_count} köp</p>
                          </div>
                                                          )}
                                </div>
                      
                        {/* Right: Purchase card – sticky on desktop */}
                                <div className="lg:sticky lg:top-8 h-fit">
                                            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
                                              {/* Price */}
                                                          <div className="mb-6">
                                                                          <div className="flex items-baseline gap-3 mb-2">
                                                                                            <span className="text-5xl font-bold text-gray-900">
                                                                                              {deal.deal_price?.toLocaleString('sv-SE')} kr
                                                                                              </span>
                                                                            {deal.original_price && deal.original_price !== deal.deal_price && (
                              <span className="text-xl text-gray-400 line-through">
                                {deal.original_price?.toLocaleString('sv-SE')} kr
                              </span>
                                                                                            )}
                                                                          </div>
                                                            {discount && discount > 0 && (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1 rounded-full border border-green-200">
                                                Du sparar {(deal.original_price - deal.deal_price)?.toLocaleString('sv-SE')} kr
                            </span>
                                                                          )}
                                                          </div>
                                            
                                              {/* Price breakdown */}
                                                          <div className="border-t border-gray-100 pt-4 mb-6 space-y-2 text-sm">
                                                                          <div className="flex justify-between text-gray-500">
                                                                                            <span>Ordinarie pris</span>
                                                                                            <span>{deal.original_price?.toLocaleString('sv-SE')} kr</span>
                                                                          </div>
                                                            {discount && discount > 0 && (
                            <div className="flex justify-between text-[#2D5A3A] font-medium">
                                                <span>Valör-rabatt</span>
                                                <span>-{discount}%</span>
                            </div>
                                                                          )}
                                                                          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
                                                                                            <span>Totalt</span>
                                                                                            <span>{deal.deal_price?.toLocaleString('sv-SE')} kr</span>
                                                                          </div>
                                                          </div>
                                            
                                              {/* CTA */}
                                                          <BuyButton dealSlug={deal.slug} spotsRemaining={spotsRemaining} />
                                            
                                                          <p className="text-center text-xs text-gray-400 mt-3">
                                                                          Köp = acceptera <Link href="/villkor" className="underline hover:text-gray-600">köpvillkor</Link>
                                                          </p>
                                            
                                              {/* Trust signals */}
                                                          <div className="mt-5 space-y-2 text-sm text-gray-600">
                                                                          <div className="flex items-center gap-2">
                                                                                            <span>🔒</span> <span>Säker betalning</span>
                                                                          </div>
                                                                          <div className="flex items-center gap-2">
                                                                                            <span>📧</span> <span>Voucher direkt på e-post</span>
                                                                          </div>
                                                                          <div className="flex items-center gap-2">
                                                                                            <span>✅</span> <span>14 dagars ångerrätt</span>
                                                                          </div>
                                                          </div>
                                            </div>
                                </div>
                      </div>
              </div>
        
          {/* JSON-LD structured data */}
              <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                                    __html: JSON.stringify({
                                                  '@context': 'https://schema.org',
                                                  '@type': 'Offer',
                                                  name: deal.title,
                                                  description: deal.description,
                                                  price: deal.deal_price,
                                                  priceCurrency: 'SEK',
                                                  availability: spotsRemaining === 0
                                                                  ? 'https://schema.org/SoldOut'
                                                                  : 'https://schema.org/InStock',
                                                  url: `https://xn--valr-ppa.se/deals/${deal.slug}`,
                                                  seller: {
                                                                  '@type': 'Organization',
                                                                  name: 'Valör',
                                                                  url: 'https://xn--valr-ppa.se',
                                                  },
                                    }),
                        }}
                      />
        </div>
      )
}
