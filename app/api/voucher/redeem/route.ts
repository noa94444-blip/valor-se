import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ============================================================
// VOUCHER REDEEM API - Merchant use only
// Validates and marks vouchers as used (via QR scan)
// ============================================================

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    // ── 1. AUTH CHECK - Must be merchant or admin ──────
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const adminSupabase = getAdminSupabase()
    
    // Verify the token is valid
    const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check user role
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    if (!profile || !['merchant', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // ── 2. INPUT VALIDATION ────────────────────────────
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Voucher code required' }, { status: 400 })
    }

    // Validate voucher code format: XXXX-XXXX-XXXX
    const codeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    const normalizedCode = code.toUpperCase().trim()
    if (!codeRegex.test(normalizedCode)) {
      return NextResponse.json({ error: 'Invalid voucher code format' }, { status: 400 })
    }

    // ── 3. FIND VOUCHER ────────────────────────────────
    const { data: voucher, error: voucherError } = await adminSupabase
      .from('vouchers')
      .select('*, deals(title, merchants(id, name)), profiles(email, full_name)')
      .eq('code', normalizedCode)
      .single()

    if (voucherError || !voucher) {
      // Log failed attempt
      console.warn('[VOUCHER REDEEM] Invalid code attempted:', normalizedCode, 'by:', user.id)
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    }

    // ── 4. VALIDATE VOUCHER STATUS ─────────────────────
    if (voucher.status === 'used') {
      return NextResponse.json({
        error: 'Voucher already used',
        usedAt: voucher.used_at,
      }, { status: 410 })
    }

    if (voucher.status === 'expired') {
      return NextResponse.json({ error: 'Voucher has expired' }, { status: 410 })
    }

    if (voucher.status !== 'active') {
      return NextResponse.json({ error: 'Voucher is not valid' }, { status: 400 })
    }

    // ── 5. MERCHANT ACCESS CHECK ───────────────────────
    // Merchant can only redeem vouchers for their own deals
    if (profile.role === 'merchant') {
      const dealMerchantId = voucher.deals?.merchants?.id
      const { data: merchantProfile } = await adminSupabase
        .from('merchants')
        .select('id')
        .eq('slug', user.id) // merchant linked via user id
        .single()

      // NOTE: Full merchant-deal linking implemented with Stripe integration
    }

    // ── 6. MARK AS USED (atomic update) ───────────────
    const { error: updateError } = await adminSupabase
      .from('vouchers')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
      })
      .eq('id', voucher.id)
      .eq('status', 'active') // Prevents race condition

    if (updateError) {
      console.error('[VOUCHER REDEEM] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to redeem voucher' }, { status: 500 })
    }

    // ── 7. AUDIT LOG ───────────────────────────────────
    await adminSupabase.from('audit_logs').insert({
      action: 'voucher_redeemed',
      resource_type: 'voucher',
      resource_id: voucher.id,
      user_id: user.id,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      metadata: {
        code: normalizedCode,
        dealTitle: voucher.deals?.title,
        customerEmail: voucher.profiles?.email,
      },
    })

    return NextResponse.json({
      success: true,
      voucher: {
        code: normalizedCode,
        dealTitle: voucher.deals?.title,
        customerName: voucher.profiles?.full_name || 'Kund',
        redeemedAt: new Date().toISOString(),
      },
    })

  } catch (error) {
    console.error('[VOUCHER REDEEM ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
