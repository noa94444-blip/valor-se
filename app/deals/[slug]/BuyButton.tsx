'use client'

import { useRouter } from 'next/navigation'

interface BuyButtonProps {
  dealSlug: string
  spotsRemaining: number | null
}

export default function BuyButton({ dealSlug, spotsRemaining }: BuyButtonProps) {
  const router = useRouter()
  const isSoldOut = spotsRemaining !== null && spotsRemaining === 0

  if (isSoldOut) {
    return (
      <div className="w-full py-4 bg-gray-200 text-gray-500 font-bold rounded-2xl text-center text-base cursor-not-allowed select-none">
        Slutsald
      </div>
    )
  }

  return (
    <button
      onClick={() => router.push(`/kassa?deal=${dealSlug}`)}
      className="w-full py-4 bg-[#2D5A3A] hover:bg-[#3a7049] active:bg-[#245030] text-white font-bold rounded-2xl text-base transition-all duration-200 shadow-sm hover:shadow-md"
    >
      Kop nu
    </button>
  )
}
