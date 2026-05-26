import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import VoucherQR from './VoucherQR'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

const PRODUCTION_URL = 'https://xn--valr-ppa.se'

export const metadata: Metadata = {
    title: 'Din Kupong - Valor',
    description: 'Visa din Valor-kupong vid inlosen.',
    robots: { index: false, follow: false },
}

export default async function VoucherPage({ params }: { params: Promise<{ code: string }> }) {
    const resolvedParams = await params
    const { data: voucher } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', resolvedParams.code.toLowerCase())
      .single()

  if (!voucher) return notFound()

  const isFullyUsed = voucher.status === 'fully_used' || voucher.status === 'redeemed'
    const isActive = voucher.status === 'active' || voucher.status === 'pending'
    const isCancelled = voucher.status === 'cancelled'

  const voucherUrl = `${PRODUCTION_URL}/voucher/${voucher.code}`
    const purchaseDate = new Date(voucher.created_at).toLocaleDateString('sv-SE', {
          day: 'numeric', month: 'long', year: 'numeric'
    })

  const usedCount = voucher.used_count || 0
    const quantity = voucher.quantity || 1
    const remaining = Math.max(0, quantity - usedCount)

  const dealTitle = voucher.deal_slug
      ? voucher.deal_slug.replace(/-/g, ' ').replace(/\d+/g, '').trim()
        : 'Valor Deal'

  const statusConfig = isFullyUsed
      ? { label: 'Anvand', color: 'bg-red-950/50 text-red-300 border-red-800' }
        : isCancelled
      ? { label: 'Avbruten', color: 'bg-gray-800 text-gray-400 border-gray-700' }
        : { label: 'Giltig', color: 'bg-green-950/50 text-green-300 border-green-800' }

  return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
              <div className="w-full max-w-sm">
                      <div className="bg-gray-900 rounded-3xl p-8 text-center shadow-2xl border border-gray-800">
                                <div className="mb-6">
                                            <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-1">VALOR</p>p>
                                            <h1 className="text-xl font-bold text-white">Din Kupong</h1>h1>
                                  {dealTitle && (
                        <p className="text-gray-400 text-sm mt-1 capitalize">{dealTitle}</p>p>
                                            )}
                                </div>div>
                      
                                <div className="mb-6">
                                            <VoucherQR voucherUrl={voucherUrl} isUsed={isFullyUsed} />
                                </div>div>
                      
                                <div className="bg-gray-800 rounded-2xl py-3 px-4 mb-4 font-mono text-sm tracking-[0.2em] text-white select-all break-all border border-gray-700">
                                  {voucher.code.toUpperCase()}
                                </div>div>
                      
                                <div className={`rounded-2xl py-2.5 px-4 font-bold text-sm mb-5 border ${statusConfig.color}`}>
                                  {statusConfig.label}
                                </div>div>
                      
                                <div className="text-sm text-gray-400 space-y-2 text-left bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                                  {voucher.customer_name && (
                        <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Kund</span>span>
                                        <span className="text-gray-200 font-medium">{voucher.customer_name}</span>span>
                        </div>div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                          <span className="text-gray-500">Kopdatum</span>span>
                                                          <span className="text-gray-200">{purchaseDate}</span>span>
                                            </div>div>
                                  {quantity > 1 && (
                        <>
                                        <div className="flex justify-between items-center">
                                                          <span className="text-gray-500">Antal</span>span>
                                                          <span className="text-gray-200">{quantity} st</span>span>
                                        </div>div>
                                        <div className="flex justify-between items-center">
                                                          <span className="text-gray-500">Anvanda</span>span>
                                                          <span className="text-gray-200">{usedCount} / {quantity}</span>span>
                                        </div>div>
                                        <div className="flex justify-between items-center">
                                                          <span className="text-gray-500">Kvar att anvanda</span>span>
                                                          <span className={remaining === 0 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                                                            {remaining}
                                                          </span>span>
                                        </div>div>
                        </>>
                      )}
                                </div>div>
                      
                        {isActive && (
                      <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                    Visa denna sida eller QR-koden for personalen vid inlosen.
                      </p>p>
                                )}
                      </div>div>
              
                      <p className="text-center text-xs text-gray-600 mt-6">
                                valor.se - Saker kupong
                      </p>p>
              </div>div>
        </div>div>
      )
}</></div>
