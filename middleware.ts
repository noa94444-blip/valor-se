import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ============================================================
// VALÖR SECURITY MIDDLEWARE - Production Grade
// Rate limiting, bot detection, RBAC, injection protection
// ============================================================

// In-memory rate limit store (per edge instance)
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

// Known bad bots and scanners
const BAD_BOTS = ['sqlmap', 'nikto', 'masscan', 'nmap', 'zgrab', 'dirbuster', 'hydra', 'burpsuite', 'acunetix', 'nessus', 'openvas', 'w3af', 'havij', 'metasploit']

// Injection patterns to block
const INJECTION_PATTERNS = [
        /\.\.\//,
        /<script/i,
        /union\s+select/i,
        /;\s*drop\s*table/i,
        /javascript:/i,
        /vbscript:/i,
        /on\w+\s*=/i,
    ]

export async function middleware(request: NextRequest) {
        const { pathname, searchParams } = request.nextUrl
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
        const ua = (request.headers.get('user-agent') || '').toLowerCase()

    // --- Bot detection ---
    if (BAD_BOTS.some(bot => ua.includes(bot))) {
                return new NextResponse('Forbidden', { status: 403 })
    }

    // --- Injection protection on URL path ---
    const fullUrl = pathname + '?' + searchParams.toString()
        if (INJECTION_PATTERNS.some(p => p.test(fullUrl))) {
                    return new NextResponse('Bad Request', { status: 400 })
        }

    // --- Rate limiting ---
    const isAuthRoute = pathname.startsWith('/api/auth') || pathname === '/logga-in' || pathname === '/registrera'
        const isApiRoute = pathname.startsWith('/api/')
        const isAdminRoute = pathname.startsWith('/admin')

    if (isAuthRoute) {
                // Auth routes: 20 requests per 15 minutes per IP
            if (!checkRateLimit(`auth:${ip}`, 20, 15 * 60 * 1000)) {
                            const url = request.nextUrl.clone()
                            url.pathname = '/logga-in'
                            url.searchParams.set('error', 'rate_limited')
                            return NextResponse.redirect(url)
            }
    } else if (isApiRoute) {
                // API routes: 60 requests per minute per IP
            if (!checkRateLimit(`api:${ip}`, 60, 60 * 1000)) {
                            return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
                                                status: 429,
                                                headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
                            })
            }
    } else if (isAdminRoute) {
                // Admin routes: 60 requests per minute per IP
            if (!checkRateLimit(`admin:${ip}`, 60, 60 * 1000)) {
                            return new NextResponse('Too many requests', { status: 429 })
            }
    }

    // --- RBAC for protected routes ---
    const protectedRoutes = ['/admin', '/konto', '/merchant']
        const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

    if (!isProtected) {
                const response = NextResponse.next()
                response.headers.set('X-Content-Type-Options', 'nosniff')
                response.headers.set('X-Frame-Options', 'DENY')
                return response
    }

    // Create Supabase SSR client
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
                                            }
                        }
        }
            )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
                const url = request.nextUrl.clone()
                url.pathname = '/logga-in'
                url.searchParams.set('redirect', pathname)
                return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_banned')
            .eq('id', user.id)
            .single()

    // Block banned users
    if (profile?.is_banned) {
                await supabase.auth.signOut()
                return NextResponse.redirect(new URL('/', request.url))
    }

    const role = profile?.role || 'customer'

    // Role-based access
    if (pathname.startsWith('/admin') && role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/logga-in'
                url.searchParams.set('redirect', pathname)
                return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/merchant') && role !== 'merchant' && role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/logga-in'
                url.searchParams.set('redirect', pathname)
                return NextResponse.redirect(url)
    }

    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
        supabaseResponse.headers.set('X-Frame-Options', 'DENY')
        return supabaseResponse
}

export const config = {
        matcher: [
                    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
                ],
}
