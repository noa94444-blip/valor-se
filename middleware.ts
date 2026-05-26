import { NextResponse, type NextRequest } from 'next/server'

// In-memory rate limiter for scan-voucher (resets on cold start)
const scanRateMap = new Map<string, { count: number; resetAt: number }>()
const SCAN_LIMIT = 10
const SCAN_WINDOW_MS = 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = scanRateMap.get(ip)
  if (!record || now > record.resetAt) {
    scanRateMap.set(ip, { count: 1, resetAt: now + SCAN_WINDOW_MS })
    return false
  }
  if (record.count >= SCAN_LIMIT) return true
  record.count++
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limit /api/scan-voucher - max 10 scans/min per IP
  if (pathname === '/api/scan-voucher') {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'For manga forsok. Vantar 1 minut och forsok igen.' },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/scan-voucher',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
