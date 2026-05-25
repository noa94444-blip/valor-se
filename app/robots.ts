// @ts-nocheck
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/admin/orders', '/api/'],
      },
    ],
    sitemap: 'https://valor-se.vercel.app/sitemap.xml',
    host: 'https://valor-se.vercel.app',
  }
}
