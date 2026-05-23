import { NextRequest, NextResponse } from 'next/server'

// DEMO MODE: Stripe webhooks are disabled in demo
export async function POST(request: NextRequest) {
  return NextResponse.json({ received: true })
}
