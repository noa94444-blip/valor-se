** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,

    async headers() {
          return [
            {
                      source: '/(.*)',
                      headers: [
                        { key: 'X-Frame-Options', value: 'DENY' },
                        { key: 'X-Content-Type-Options', value: 'nosniff' },
                        { key: 'X-XSS-Protection', value: '1; mode=block' },
                        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation()' },
                        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                        {
                                      key: 'Content-Security-Policy',
                                      value: [
                                                      "default-src 'self'",
                                                      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
                                                      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                                                      "font-src 'self' https://fonts.gstatic.com",
                                                      "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
                                                      "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co",
                                                      "frame-src https://js.stripe.com https://hooks.stripe.com",
                                                      "object-src 'none'",
                                                      "base-uri 'self'",
                                                    ].join('; '),
                        },
                                ],
            },
            {
                      source: '/api/(.*)',
                      headers: [
                        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
                        { key: 'X-Content-Type-Options', value: 'nosniff' },
                                ],
            },
                ]
    },

    images: {
          remotePatterns: [
            { protocol: 'https', hostname: '**.supabase.co' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
                ],
    },
}

module.exports = nextConfig
