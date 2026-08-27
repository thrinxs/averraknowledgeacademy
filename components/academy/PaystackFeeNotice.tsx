'use client'

interface Props {
  amountNGN: number
  isInternational: boolean
}

function calculateFee(amount: number, international: boolean) {
  if (international) {
    const fee = Math.round(amount * 0.039) + 100
    return { fee, total: amount + fee, breakdown: '3.9% + ₦100 (international card rate, no cap)' }
  }
  const pct = Math.round(amount * 0.015)
  const flat = amount >= 2500 ? 100 : 0
  const fee = Math.min(pct + flat, 2000)
  return {
    fee,
    total: amount + fee,
    breakdown: amount < 2500
      ? '1.5% only — no flat fee for transactions under ₦2,500'
      : '1.5% + ₦100, capped at ₦2,000 (local card rate)',
  }
}

export default function PaystackFeeNotice({ amountNGN, isInternational }: Props) {
  if (!amountNGN || amountNGN === 0) return null
  const { fee, total, breakdown } = calculateFee(amountNGN, isInternational)

  return (
    <div className="rounded-xl p-4 border" style={{ backgroundColor: '#F0F6FB', borderColor: '#497296' }}>
      <p className="text-xs font-bold mb-3" style={{ color: '#062850' }}>
        💳 Paystack Processing Fee Breakdown
      </p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Your enrolment fee</span>
          <span className="font-semibold" style={{ color: '#062850' }}>₦{amountNGN.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Paystack processing fee</span>
          <span className="font-semibold text-amber-600">+ ₦{fee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
          <span style={{ color: '#062850' }}>Total you will be charged</span>
          <span style={{ color: '#062850' }}>₦{total.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        {breakdown}. This fee is charged by Paystack, not Averra.
        {isInternational && <> Your bank will also apply a currency conversion rate.</>}{' '}
        Paystack will confirm the exact amount before you pay.
      </p>
      <div className="mt-3 p-2 rounded-lg text-xs text-center font-medium" style={{ backgroundColor: '#EBF4FF', color: '#325E84' }}>
        💡 No processing fee on GBP or EUR bank transfers
      </div>
    </div>
  )
}
