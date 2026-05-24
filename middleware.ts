import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ============================================================
// VALÖR SECURITY MIDDLEWARE - Production Grade
// Rate limiting, RBAC, bot detection, injection protection
// ============================================================

// Simple in-memory rate limiter (per edge function instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

const BLOCKED_BOTS = ['sqlmap', 'nikto', 'masscan', 'zgrab', 'python-requests/2.']

function isBadBot(ua: string): boolean {
  const lower = ua.toLowerCase()
  return BLOCKED_BOTS.some(b => lower.includes(b))
}

function hasInjection(url: string): boolean {
  try {
    const decoded = decodeURIComponent(url).toLowerCase()
    return ['../','<script','javascript:','union select','eval(','/etc/passwd'].some(p => decoded.includes(p))
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
  const ua = request.headers.get('user-agent') || ''

  // 1. Block malicious bots
  if (isBadBot(ua)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 2. Block injection attempts
  if (hasInjection(request.url)) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  // 3. Rate limiting
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(ip + ':api', 30, 60_000)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  if (pathname === '/logga-in' || pathname === '/registrera') {
    if (!checkRateLimit(ip + ':auth', 10, 900_000)) {
      return new NextResponse('Too many login attempts. Wait 15 minutes.', { status: 429 })
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!checkRateLimit(ip + ':admin', 60, 60_000)) {
      return new NextResponse('Rate limited', { status: 429 })
    }
  }

  // 4. Setup Supabase session
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 5. RBAC Route Protection

  // /admin - admin role only
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = new URL('/logga-in', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (profile?.role !== 'admin') {
      console.warn('[SEC] Unauthorized admin access:', user.email, 'from', ip)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // /konto - must be logged in
  if (pathname.startsWith('/konto')) {
    if (!user) {
      const url = new URL('/logga-in', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // /merchant/dashboard + /merchant/settings - merchant or admin only
  if (pathname.match(/^\/merchant\/(dashboard|settings)/)) {
    if (!user) {
      const url = new URL('/logga-in', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) return NextResponse.redirect(new URL('/', request.url))
    if (!profile || !['merchant', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 6. Add security headers to response
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/konto/:path*',
    '/merchant/dashboard/:path*',
    '/merchant/settings/:path*',
    '/api/:path*',
    '/logga-in',
    '/registrera',
  ],
}
