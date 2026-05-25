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
    sitemap: 'https://xn--valr-7qa.se/sitemap.xml',
    host: 'https://xn--valr-7qa.se',
  }
}
