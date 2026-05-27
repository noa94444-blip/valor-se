// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const metadata: Metadata = {
  title: 'Din Kupong – Valor',
  description: 'Visa din Valor-kupong vid inlosen.',
  robots: { index: false, follow: false },
}

export default async function VoucherPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params
  // Search by uppercase code (codes are stored uppercase)
  const upperCode = resolvedParams.code.toUpperCase()
  const { data: voucher } = await supabase
    .from('vouchers')
    .select('*')
    .eq('code', upperCode)
    .single()

  // Also try original case if uppercase didn't work
  let finalVoucher = voucher
  if (!finalVoucher) {
    const { data: v2 } = await supabase
      .from('vouchers')
      .select('*')
      .ilike('code', resolvedParams.code)
      .single()
    finalVoucher = v2
  }

  if (!finalVoucher) return notFound()

  const isFullyUsed = finalVoucher.status === 'fully_used' || finalVoucher.status === 'redeemed'
  const isActive = finalVoucher.status === 'active' || finalVoucher.status === 'pending'
  const isCancelled = finalVoucher.status === 'cancelled'

  const usedCount = finalVoucher.used_count || 0
  const quantity = finalVoucher.quantity || 1
  const remaining = Math.max(0, quantity - usedCount)

  const dealTitle = finalVoucher.deal_slug
    ? finalVoucher.deal_slug.replace(/-/g, ' ').replace(/\d+/g, '').trim()
    : 'Valor Deal'

  const statusLabel = isFullyUsed ? 'Använd' : isCancelled ? 'Avbruten' : 'Giltig'
  const statusBg = isFullyUsed ? '#3d1a1a' : isCancelled ? '#2d2d2d' : '#1a3d2a'
  const statusColor = isFullyUsed ? '#e74c3c' : isCancelled ? '#888' : '#2ecc71'

  const purchaseDate = new Date(finalVoucher.created_at).toLocaleDateString('sv-SE', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const totalPrice = finalVoucher.total_price
    ? finalVoucher.total_price.toLocaleString('sv-SE')
    : null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C1A17',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: '#242220',
        border: '1px solid #3a3530',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ color: '#C9A84C', fontSize: '28px', fontWeight: '700', letterSpacing: '0.15em', marginBottom: '32px', fontFamily: 'Playfair Display, serif' }}>
          VALÖR
        </div>

        {/* Status badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 20px',
          background: statusBg,
          borderRadius: '100px',
          marginBottom: '32px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
          <span style={{ color: statusColor, fontSize: '14px', fontWeight: '600' }}>{statusLabel}</span>
        </div>

        {/* Deal title */}
        <h1 style={{ color: '#F5F2ED', fontSize: '28px', fontWeight: '600', margin: '0 0 8px', textTransform: 'capitalize', fontFamily: 'Playfair Display, serif' }}>
          {dealTitle}
        </h1>

        {/* Voucher code */}
        <div style={{ margin: '32px 0', padding: '24px', background: '#1C1A17', borderRadius: '12px', border: '1px solid #C9A84C33' }}>
          <div style={{ color: '#8a8a7a', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Kupongkod
          </div>
          <div style={{ color: '#C9A84C', fontSize: '28px', fontWeight: '700', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
            {upperCode}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
          {totalPrice && (
            <div style={{ padding: '16px', background: '#1C1A17', borderRadius: '8px' }}>
              <div style={{ color: '#8a8a7a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Betalt</div>
              <div style={{ color: '#F5F2ED', fontSize: '16px', fontWeight: '600' }}>{totalPrice} kr</div>
            </div>
          )}
          <div style={{ padding: '16px', background: '#1C1A17', borderRadius: '8px' }}>
            <div style={{ color: '#8a8a7a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Återstår</div>
            <div style={{ color: '#F5F2ED', fontSize: '16px', fontWeight: '600' }}>{remaining} av {quantity}</div>
          </div>
          <div style={{ padding: '16px', background: '#1C1A17', borderRadius: '8px' }}>
            <div style={{ color: '#8a8a7a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Köpdatum</div>
            <div style={{ color: '#F5F2ED', fontSize: '14px', fontWeight: '500' }}>{purchaseDate}</div>
          </div>
        </div>

        {/* Instructions */}
        {isActive && (
          <div style={{ padding: '20px', background: '#1a3d2a44', border: '1px solid #2D5A3A', borderRadius: '12px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ color: '#2ecc71', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
              ✓ Hur du använder din kupong
            </div>
            <div style={{ color: '#a0a090', fontSize: '13px', lineHeight: '1.7' }}>
              Visa den här sidan för personalen vid anläggningen. De scannar koden eller anger den manuellt.
            </div>
          </div>
        )}

        {isFullyUsed && (
          <div style={{ padding: '20px', background: '#3d1a1a44', border: '1px solid #e74c3c55', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ color: '#e74c3c', fontWeight: '600', fontSize: '14px' }}>
              Denna kupong har redan använts.
            </div>
          </div>
        )}

        {/* Back link */}
        <a href="/deals" style={{ color: '#C9A84C', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Se fler deals
        </a>
      </div>
    </div>
  )
}
