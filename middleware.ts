import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ============================================================
// VALÖR SECURITY MIDDLEWARE - Production Grade
// Rate limiting, RBAC, bot detection, audit logging
// ============================================================

// In-memory rate limit store (per Vercel Edge function instance)
// For production scale: use Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimitKey(ip: string, route: string): string {
  return ip + ':' + route
}

function checkRateLimit(ip: string, route: string, limit: number, windowMs: number): boolean {
  const key = getRateLimitKey(ip, route)
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (entry.count >= limit) {
    return false // rate limited
  }

  entry.count++
  return true // allowed
}

// Known bad bot signatures
const BOT_SIGNATURES = [
  'sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab',
  'python-requests/2.', 'go-http-client', 'curl/7',
  'scrapy', 'wget/', 'libwww-perl',
]

function isMaliciousBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return BOT_SIGNATURES.some(sig => ua.includes(sig))
}

// Path traversal / injection detection
function hasInjectionPatterns(url: string): boolean {
  const decoded = decodeURIComponent(url).toLowerCase()
  const patterns = [
    '../', '..\\', '%2e%2e', 
    '<script', 'javascript:', 'vbscript:',
    'union select', 'drop table', 'insert into',
    'eval(', 'exec(',
    '/etc/passwd', '/etc/shadow',
  ]
  return patterns.some(p => decoded.includes(p))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || ''

  // ── 1. BLOCK MALICIOUS BOTS ──────────────────────────────
  if (isMaliciousBot(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── 2. PATH INJECTION PROTECTION ────────────────────────
  if (hasInjectionPatterns(request.url)) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  // ── 3. RATE LIMITING ─────────────────────────────────────
  // API routes: 30 req/min
  if (pathname.startsWith('/api/')) {
    const allowed = checkRateLimit(ip, 'api', 30, 60_000)
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  // Login/register: 10 attempts/15min (brute force protection)
  if (pathname.startsWith('/logga-in') || pathname.startsWith('/registrera')) {
    const allowed = checkRateLimit(ip, 'auth', 10, 900_000)
    if (!allowed) {
      return new NextResponse(
        'Too many login attempts. Please wait 15 minutes.',
        { status: 429 }
      )
    }
  }

  // Admin: 60 req/min (extra protection)
  if (pathname.startsWith('/admin')) {
    const allowed = checkRateLimit(ip, 'admin', 60, 60_000)
    if (!allowed) {
      return new NextResponse('Rate limited', { status: 429 })
    }
  }

  // ── 4. SUPABASE AUTH SESSION ─────────────────────────────
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

  // IMPORTANT: Always use getUser() not getSession() - getUser() validates server-side
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // ── 5. ROUTE PROTECTION (RBAC) ───────────────────────────

  // /admin - ADMIN ONLY
  if (pathname.startsWith('/admin')) {
    if (!user || authError) {
      const loginUrl = new URL('/logga-in', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', user.id)
      .single()

    // Block banned users immediately
    if (profile?.is_banned) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (profile?.role !== 'admin') {
      // Log unauthorized admin access attempt
      console.warn('[SECURITY] Unauthorized admin access attempt:', {
        userId: user.id,
        email: user.email,
        ip,
        pathname,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // /konto - AUTHENTICATED USERS ONLY
  if (pathname.startsWith('/konto')) {
    if (!user || authError) {
      const loginUrl = new URL('/logga-in', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if banned
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // /merchant/dashboard and /merchant/settings - MERCHANT OR ADMIN ONLY
  if (pathname.match(/^/merchant/(dashboard|settings)/)) {
    if (!user || authError) {
      const loginUrl = new URL('/logga-in', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', user.id)
      .single()

    if (profile?.is_banned) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (!profile || !['merchant', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // ── 6. SECURITY RESPONSE HEADERS ────────────────────────
  supabaseResponse.headers.set('X-Request-ID', crypto.randomUUID())
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
    // Exclude static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
