// @ts-nocheck
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/konto/', '/logga-in/', '/registrera/'],
      },
    ],
    sitemap: 'https://xn--valr-ppa.se/sitemap.xml',
    host: 'https://xn--valr-ppa.se',
  }
}
