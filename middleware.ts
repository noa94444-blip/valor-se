import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skapa Supabase-klient for middleware
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Skyddade routes: kraver inloggning
  const protectedRoutes = ['/konto', '/merchant', '/admin']
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

  if (isProtected && !session) {
    const loginUrl = new URL('/logga-in', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Roll-baserat skydd
  if (session && (pathname.startsWith('/admin') || pathname.startsWith('/merchant'))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const role = profile?.role ?? 'customer'

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/konto', request.url))
    }

    if (pathname.startsWith('/merchant') && role !== 'merchant' && role !== 'admin') {
      return NextResponse.redirect(new URL('/konto', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/konto/:path*',
    '/merchant/:path*',
    '/admin/:path*',
    '/api/scan-voucher',
  ],
}
