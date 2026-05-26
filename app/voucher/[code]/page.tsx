import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import QRCode from 'qrcode.react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Props {
  params: { code: string }
}

export default async function VoucherPage({ params }: Props) {
  const { data: voucher } = await supabase
    .from('vouchers')
    .select('*')
    .eq('code', params.code.toLowerCase())
    .single()

  if (!voucher) return notFound()

  const isUsed = voucher.status === 'fully_used' || voucher.status === 'redeemed'
  const voucherUrl = `https://www.xn--valr-7qa.se/voucher/${voucher.code}`
  const purchaseDate = new Date(voucher.created_at).toLocaleDateString('sv-SE')
  const usedCount = voucher.used_count || 0
  const quantity = voucher.quantity || 1

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-3xl p-8 text-center shadow-2xl border border-gray-800">

        <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-6">
          valor.se
        </p>

        <h1 className="text-xl font-bold text-white mb-1">Din Kupong</h1>
        {voucher.deal_slug && (
          <p className="text-gray-400 text-sm mb-6 capitalize">
            {voucher.deal_slug.replace(/-/g, ' ').replace(/\d+/g, '').trim()}
          </p>
        )}

        {/* QR-kod */}
        <div className={`inline-block p-4 rounded-2xl mb-5 ${isUsed ? 'opacity-20 grayscale' : 'bg-white'}`}>
          <QRCode value={voucherUrl} size={180} />
        </div>

        {/* Kod text */}
        <div className="bg-gray-800 rounded-xl py-3 px-4 mb-4 font-mono text-sm tracking-widest text-white select-all break-all">
          {voucher.code}
        </div>

        {/* Status */}
        <div className={`rounded-xl py-2 px-4 font-bold text-base mb-5 ${
          isUsed
            ? 'bg-red-900/50 text-red-300 border border-red-800'
            : 'bg-green-900/50 text-green-300 border border-green-800'
        }`}>
          {isUsed ? 'Anvand' : 'Giltig'}
        </div>

        {/* Detaljer */}
        <div className="text-sm text-gray-500 space-y-1">
          {voucher.customer_name && (
            <p>Kund: <span className="text-gray-300">{voucher.customer_name}</span></p>
          )}
          <p>Kopt: <span className="text-gray-300">{purchaseDate}</span></p>
          {quantity > 1 && (
            <p>Anvant: <span className="text-gray-300">{usedCount} / {quantity}</span></p>
          )}
          {!isUsed && voucher.expires_at && (
            <p>Giltig till: <span className="text-gray-300">
              {new Date(voucher.expires_at).toLocaleDateString('sv-SE')}
            </span></p>
          )}
        </div>

        <p className="text-gray-700 text-xs mt-6">
          Visa denna sida for handlaren vid inlosen
        </p>
      </div>
    </div>
  )
}
