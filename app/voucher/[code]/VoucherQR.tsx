'use client'

import { QRCodeSVG } from 'qrcode.react'

interface Props {
  voucherUrl: string
  isUsed: boolean
}

export default function VoucherQR({ voucherUrl, isUsed }: Props) {
  return (
    <div className={`inline-block p-4 rounded-2xl mb-5 ${isUsed ? 'opacity-20 grayscale' : 'bg-white'}`}>
      <QRCodeSVG value={voucherUrl} size={180} />
    </div>
  )
}
