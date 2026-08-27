'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  currency: string        // 'GBP' or 'EUR'
  amount: number          // amount in foreign currency
  onRateLoaded?: (ngnAmount: number) => void
}

export default function ExchangeRateDisplay({
  currency,
  amount,
  onRateLoaded,
}: Props) {
  const [rate, setRate] = useState<number | null>(null)
  const [source, setSource] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currency === 'NGN') return
    fetch('/api/exchange-rate')
      .then((r) => r.json())
      .then((data) => {
        const r = currency === 'GBP' ? data.GBP : data.EUR
        setRate(r)
        setSource(data.source)
        if (onRateLoaded) onRateLoaded(Math.round(amount * r))
      })
      .catch(() => {
        const fallback = currency === 'GBP' ? 2100 : 1950
        setRate(fallback)
        setSource('fallback')
        if (onRateLoaded) onRateLoaded(Math.round(amount * fallback))
      })
      .finally(() => setLoading(false))
  }, [currency, amount, onRateLoaded])

  if (currency === 'NGN') return null

  const symbol = currency === 'GBP' ? '£' : '€'
  const ngnAmount = rate ? Math.round(amount * rate) : null

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">💱</span>
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
              <p className="text-xs text-amber-700">Fetching live exchange rate...</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-amber-800">
                Currency Conversion to NGN
              </p>
              <p className="text-xs text-amber-700 mt-1">
                {source === 'live' ? '🟢 Live rate:' : '🟡 Approximate rate:'}{' '}
                <span className="font-bold">
                  {symbol}1 = ₦{rate?.toLocaleString()}
                </span>
              </p>
              {ngnAmount && (
                <p className="text-xs text-amber-700 mt-1">
                  Your total{' '}
                  <span className="font-bold">
                    {symbol}{amount.toLocaleString()}
                  </span>{' '}
                  ≈{' '}
                  <span className="font-bold">
                    ₦{ngnAmount.toLocaleString()}
                  </span>{' '}
                  NGN
                </p>
              )}
              <p className="text-xs text-amber-600 mt-2">
                Paystack will show the exact NGN amount and any
                transaction fees at checkout. Your card is charged in NGN.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
