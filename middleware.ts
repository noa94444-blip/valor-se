import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Protected routes
const ADMIN_ROUTES = ['/admin']
const MERCHANT_ROUTES = ['/merchant']
const AUTH_ROUTES = ['/konto']

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

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /admin - requires login (role check handled inside admin page)
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/logga-in', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect /merchant - requires login
  if (MERCHANT_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/logga-in', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect /konto - requires login
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/logga-in', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
