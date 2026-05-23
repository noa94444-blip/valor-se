import { NextRequest, NextResponse } from 'next/server'

// DEMO MODE: This is a demo checkout route that doesn't require Stripe or Supabase
export async function POST(request: NextRequest) {
  try {
    const { dealSlug, dealTitle, price } = await request.json()

    // Generate a demo voucher code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const code = Array.from({ length: 12 }, (_, i) => 
      i === 3 || i === 7 ? '-' : chars[Math.floor(Math.random() * chars.length)]
    ).join('')

    return NextResponse.json({
      success: true,
      code,
      dealSlug: dealSlug || 'demo',
      dealTitle: dealTitle || 'Demo Deal',
      price: price || 0,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
