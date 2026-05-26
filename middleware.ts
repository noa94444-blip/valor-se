import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Protected routes that require authentication
const ADMIN_ROUTES = ['/admin']
const MERCHANT_ROUTES = ['/merchant']
const AUTH_ROUTES = ['/konto']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

  // Create a response to modify
  let response = NextResponse.next({
        request: {
                headers: request.headers,
        },
  })

  // Create Supabase server client
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

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  // Protect /admin - must be logged in (add role check when roles are implemented)
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
        if (!user) {
                const loginUrl = new URL('/logga-in', request.url)
                loginUrl.searchParams.set('redirect', pathname)
                return NextResponse.redirect(loginUrl)
        }
  }

  // Protect /merchant - must be logged in
  if (MERCHANT_ROUTES.some(route => pathname.startsWith(route))) {
        if (!user) {
                const loginUrl = new URL('/logga-in', request.url)
                loginUrl.searchParams.set('redirect', pathname)
                return NextResponse.redirect(loginUrl)
        }
  }

  // Protect /konto - must be logged in
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
          '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
        ],
}
