import { NextResponse } from 'next/server'

// Cache the rate for 1 hour to avoid hitting API limits
let cachedRates: { GBP: number; EUR: number; timestamp: number } | null = null
const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour

export async function GET() {
  try {
    // Return cached rates if still fresh
    if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION_MS) {
      return NextResponse.json({
        GBP: cachedRates.GBP,
        EUR: cachedRates.EUR,
        source: 'cache',
      })
    }

    const apiKey = process.env.EXCHANGE_RATE_API_KEY
    const fallbackGBP = Number(process.env.FALLBACK_GBP_TO_NGN || 2100)
    const fallbackEUR = Number(process.env.FALLBACK_EUR_TO_NGN || 1950)

    if (!apiKey) {
      return NextResponse.json({
        GBP: fallbackGBP,
        EUR: fallbackEUR,
        source: 'fallback',
      })
    }

    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/NGN`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) throw new Error('API request failed')

    const data = await res.json()

    if (data.result !== 'success') throw new Error('API returned error')

    // API gives NGN as base, so we get how many NGN per 1 GBP/EUR
    // rates are NGN per 1 unit of foreign currency
    const gbpRate = data.conversion_rates?.GBP
      ? Math.round(1 / data.conversion_rates.GBP)
      : fallbackGBP

    const eurRate = data.conversion_rates?.EUR
      ? Math.round(1 / data.conversion_rates.EUR)
      : fallbackEUR

    // Cache the result
    cachedRates = {
      GBP: gbpRate,
      EUR: eurRate,
      timestamp: Date.now(),
    }

    return NextResponse.json({
      GBP: gbpRate,
      EUR: eurRate,
      source: 'live',
    })

  } catch (err) {
    console.error('Exchange rate fetch error:', err)
    return NextResponse.json({
      GBP: Number(process.env.FALLBACK_GBP_TO_NGN || 2100),
      EUR: Number(process.env.FALLBACK_EUR_TO_NGN || 1950),
      source: 'fallback',
    })
  }
}
