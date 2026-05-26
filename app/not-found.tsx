import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1C1A17] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-10">
        <div className="text-[#C9A84C] font-bold tracking-[0.3em] text-2xl">VALÖR</div>
      </div>

      {/* 404 */}
      <div className="text-center mb-10">
        <div className="text-8xl font-bold text-white/5 select-none mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Sidan hittades inte</h1>
        <p className="text-white/50 text-sm max-w-sm">
          Sidan du letar efter finns inte eller har flyttats. Kolla att URL:en stammer.
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-[#C9A84C]/30 mb-10" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/"
          className="flex-1 bg-[#C9A84C] hover:bg-[#b8973d] text-[#1C1A17] font-semibold py-3 px-6 rounded-xl text-center text-sm tracking-wide transition-colors"
        >
          Till startsidan
        </Link>
        <Link
          href="/deals"
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold py-3 px-6 rounded-xl text-center text-sm tracking-wide transition-colors"
        >
          Se alla deals
        </Link>
      </div>

      {/* Help text */}
      <p className="mt-8 text-white/30 text-xs text-center">
        Behover du hjalp?{' '}
        <Link href="/kontakt" className="text-[#C9A84C]/70 hover:text-[#C9A84C] underline transition-colors">
          Kontakta oss
        </Link>
      </p>
    </div>
  )
}
